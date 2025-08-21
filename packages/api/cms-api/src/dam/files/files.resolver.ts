import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Inject, NotFoundException, Type } from "@nestjs/common";
import { Args, Context, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";
import { basename, extname } from "path";

import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { SkipBuild } from "../../builds/skip-build.decorator";
import { CometValidationException } from "../../common/errors/validation.exception";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { FileValidationService } from "../../file-utils/file-validation.service";
import { createFileUploadInputFromUrl, slugifyFilename } from "../../file-utils/files.utils";
import { AffectedEntity } from "../../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { DAM_FILE_VALIDATION_SERVICE } from "../dam.constants";
import { DamScopeInterface } from "../types";
import { DamMediaAlternative } from "./dam-media-alternatives/entities/dam-media-alternative.entity";
import { CopyFilesResponseInterface, createCopyFilesResponseType } from "./dto/copyFiles.types";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createFileArgs, FileArgsInterface, MoveDamFilesArgs } from "./dto/file.args";
import { UpdateFileInput } from "./dto/file.input";
import { FilenameInput, FilenameResponse } from "./dto/filename.args";
import { createFindCopiesOfFileInScopeArgs, FindCopiesOfFileInScopeArgsInterface } from "./dto/find-copies-of-file-in-scope.args";
import { UpdateDamFileArgs } from "./dto/update-dam-file.args";
import { FileInterface } from "./entities/file.entity";
import { FolderInterface } from "./entities/folder.entity";
import { FilesService } from "./files.service";

export function createFilesResolver({
    File,
    Folder,
    Scope: PassedScope,
}: {
    File: Type<FileInterface>;
    Folder: Type<FolderInterface>;
    Scope?: Type<DamScopeInterface>;
}): Type<unknown> {
    const Scope = PassedScope ?? EmptyDamScope;
    const hasNonEmptyScope = PassedScope != null;

    function nonEmptyScopeOrNothing(scope: DamScopeInterface): DamScopeInterface | undefined {
        // GraphQL sends the scope object with a null prototype ([Object: null prototype] { <key>: <value> }), but MikroORM uses the
        // object's hasOwnProperty method internally, resulting in a "object.hasOwnProperty is not a function" error. To fix this, we
        // create a "real" JavaScript object by using the spread operator.
        // See https://github.com/mikro-orm/mikro-orm/issues/2846 for more information.
        return hasNonEmptyScope ? { ...scope } : undefined;
    }

    const FileArgs = createFileArgs({ Scope });
    const CopyFilesResponse = createCopyFilesResponseType({ File });
    const FindCopiesOfFileInScopeArgs = createFindCopiesOfFileInScopeArgs({ Scope, hasNonEmptyScope });

    @ObjectType()
    class PaginatedDamFiles extends PaginatedResponseFactory.create(File) {}

    @RequiredPermission(["dam"], { skipScopeCheck: !hasNonEmptyScope })
    @Resolver(() => File)
    class FilesResolver {
        constructor(
            private readonly filesService: FilesService,
            @InjectRepository("DamFile") private readonly filesRepository: EntityRepository<FileInterface>,
            @InjectRepository("DamFolder") private readonly foldersRepository: EntityRepository<FolderInterface>,
            @Inject(DAM_FILE_VALIDATION_SERVICE) private readonly fileValidationService: FileValidationService,
            private readonly entityManager: EntityManager,
        ) {}

        @Query(() => PaginatedDamFiles)
        async damFilesList(@Args({ type: () => FileArgs }) args: FileArgsInterface): Promise<PaginatedDamFiles> {
            const [files, totalCount] = await this.filesService.findAndCount(args, nonEmptyScopeOrNothing(args.scope));
            return new PaginatedDamFiles(files, totalCount);
        }

        @Query(() => File)
        @AffectedEntity(File)
        async damFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const file = await this.filesService.findOneById(id);
            if (!file) {
                throw new NotFoundException(id);
            }
            return file;
        }

        @Query(() => [File])
        //@ AffectedEntity is not required here
        async findCopiesOfFileInScope(
            @Args({ type: () => FindCopiesOfFileInScopeArgs }) { id, scope, imageCropArea }: FindCopiesOfFileInScopeArgsInterface,
        ): Promise<FileInterface[]> {
            return this.filesService.findCopiesOfFileInScope(id, imageCropArea, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => File)
        @AffectedEntity(File)
        async updateDamFile(@Args({ type: () => UpdateDamFileArgs }) { id, input }: UpdateDamFileArgs): Promise<FileInterface> {
            return this.filesService.updateById(id, input);
        }

        @Mutation(() => File)
        @SkipBuild()
        async importDamFileByDownload(
            @Args("url", { type: () => String }) url: string,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
            @Args("input", { type: () => UpdateFileInput }) { image: imageInput, ...input }: UpdateFileInput,
        ): Promise<FileInterface> {
            const file = await createFileUploadInputFromUrl(url);
            const validationResult = await this.fileValidationService.validateFile(file);
            if (validationResult !== undefined) {
                throw new CometValidationException(validationResult);
            }

            const uploadedFile = await this.filesService.upload(file, {
                ...input,
                imageCropArea: imageInput?.cropArea,
                folderId: input.folderId ? input.folderId : undefined,
                scope: nonEmptyScopeOrNothing(scope),
            });
            return uploadedFile;
        }

        @Mutation(() => [File])
        @AffectedEntity(Folder, { idArg: "targetFolderId", nullable: true })
        @AffectedEntity(File, { idArg: "fileIds" })
        @SkipBuild()
        async moveDamFiles(
            @Args({ type: () => MoveDamFilesArgs }) { fileIds, targetFolderId }: MoveDamFilesArgs,
            @GetCurrentUser() user: CurrentUser,
        ): Promise<FileInterface[]> {
            let targetFolder = null;
            if (targetFolderId !== null) {
                targetFolder = await this.foldersRepository.findOneOrFail(targetFolderId);
            }

            const files = await this.filesRepository.find({ id: { $in: fileIds } });

            return this.filesService.moveBatch(files, targetFolder);
        }

        @Mutation(() => CopyFilesResponse)
        @AffectedEntity(File, { idArg: "fileIds" })
        @AffectedEntity(Folder, { idArg: "inboxFolderId" })
        @SkipBuild()
        async copyFilesToScope(
            @GetCurrentUser() user: CurrentUser,
            @Args("fileIds", { type: () => [ID] }) fileIds: string[],
            @Args("inboxFolderId", {
                type: () => ID,
            })
            inboxFolderId: string,
        ): Promise<CopyFilesResponseInterface> {
            const copyFilesResponse = await this.filesService.copyFilesToScope({ fileIds, inboxFolderId });

            await this.entityManager.flush();
            return copyFilesResponse;
        }

        @Mutation(() => File)
        @AffectedEntity(File)
        @SkipBuild()
        async archiveDamFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const entity = await this.filesRepository.findOneOrFail(id);
            entity.archived = true;

            await this.entityManager.persistAndFlush(entity);
            return entity;
        }

        @Mutation(() => [File])
        @AffectedEntity(File, { idArg: "ids" })
        @SkipBuild()
        async archiveDamFiles(@Args("ids", { type: () => [ID] }) ids: string[]): Promise<FileInterface[]> {
            const entities = await this.filesRepository.find({ id: { $in: ids } });

            for (const entity of entities) {
                entity.archived = true;
            }

            await this.entityManager.flush();
            return entities;
        }

        @Mutation(() => File)
        @AffectedEntity(File)
        @SkipBuild()
        async restoreDamFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const entity = await this.filesRepository.findOneOrFail(id);
            entity.archived = false;

            await this.entityManager.persistAndFlush(entity);
            return entity;
        }

        @Mutation(() => [File])
        @AffectedEntity(File, { idArg: "ids" })
        @SkipBuild()
        async restoreDamFiles(@Args("ids", { type: () => [ID] }) ids: string[]): Promise<FileInterface[]> {
            const entities = await this.filesRepository.find({ id: { $in: ids } });

            for (const entity of entities) {
                entity.archived = false;
            }

            await this.entityManager.flush();
            return entities;
        }

        @Mutation(() => Boolean)
        @AffectedEntity(File)
        @SkipBuild()
        async deleteDamFile(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            return this.filesService.delete(id);
        }

        @Query(() => Boolean)
        async damIsFilenameOccupied(
            @Args("filename") filename: string,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
            @Args("folderId", { nullable: true }) folderId?: string,
        ): Promise<boolean> {
            const extension = extname(filename);
            const name = basename(filename, extension);
            const slugifiedName = slugifyFilename(name, extension);

            return (
                (await this.filesService.findOneByFilenameAndFolder({ filename: slugifiedName, folderId }, nonEmptyScopeOrNothing(scope))) !== null
            );
        }

        @Query(() => [FilenameResponse])
        async damAreFilenamesOccupied(
            @Args("filenames", { type: () => [FilenameInput] }) filenames: Array<FilenameInput>,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
        ): Promise<Array<FilenameResponse>> {
            const response: Array<FilenameResponse> = [];

            for (const { name, folderId } of filenames) {
                const extension = extname(name);
                const filename = basename(name, extension);
                const slugifiedName = slugifyFilename(filename, extension);

                const existingFile = await this.filesService.findOneByFilenameAndFolder(
                    { filename: slugifiedName, folderId },
                    nonEmptyScopeOrNothing(scope),
                );
                const isOccupied = existingFile !== null;

                response.push({
                    name,
                    folderId,
                    isOccupied,
                });
            }

            return response;
        }

        @ResolveField(() => String)
        async fileUrl(@Parent() file: FileInterface, @Context("req") req: IncomingMessage): Promise<string> {
            return this.filesService.createFileUrl(file, {
                previewDamUrls: Boolean(req.headers["x-preview-dam-urls"]),
            });
        }

        @ResolveField(() => [File])
        async duplicates(@Parent() file: FileInterface): Promise<FileInterface[]> {
            const files = await this.filesService.findAllByHash(file.contentHash, { scope: file.scope });
            return files.filter((f) => f.id !== file.id);
        }

        @ResolveField(() => String)
        async damPath(@Parent() file: FileInterface): Promise<string> {
            return this.filesService.getDamPath(file);
        }

        @ResolveField(() => [DamMediaAlternative])
        async alternativesForThisFile(@Parent() file: FileInterface): Promise<DamMediaAlternative[]> {
            return file.alternativesForThisFile.loadItems();
        }

        @ResolveField(() => [DamMediaAlternative])
        async thisFileIsAlternativeFor(@Parent() file: FileInterface): Promise<DamMediaAlternative[]> {
            return file.thisFileIsAlternativeFor.loadItems();
        }
    }

    return FilesResolver;
}
