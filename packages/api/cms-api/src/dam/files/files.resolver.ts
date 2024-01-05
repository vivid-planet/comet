import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, NotFoundException, Type } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { basename, extname } from "path";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { SkipBuild } from "../../builds/skip-build.decorator";
import { SubjectEntity } from "../../common/decorators/subject-entity.decorator";
import { CometValidationException } from "../../common/errors/validation.exception";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { ContentScopeService } from "../../content-scope/content-scope.service";
import { ScopeGuardActive } from "../../content-scope/decorators/scope-guard-active.decorator";
import { DAM_FILE_VALIDATION_SERVICE } from "../dam.constants";
import { DamScopeInterface } from "../types";
import { CopyFilesResponseInterface, createCopyFilesResponseType } from "./dto/copyFiles.types";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createFileArgs, FileArgsInterface, MoveDamFilesArgs } from "./dto/file.args";
import { UpdateFileInput } from "./dto/file.input";
import { FilenameInput, FilenameResponse } from "./dto/filename.args";
import { createFindCopiesOfFileInScopeArgs, FindCopiesOfFileInScopeArgsInterface } from "./dto/find-copies-of-file-in-scope.args";
import { FileInterface } from "./entities/file.entity";
import { FolderInterface } from "./entities/folder.entity";
import { FileValidationService } from "./file-validation.service";
import { FilesService } from "./files.service";
import { download, slugifyFilename } from "./files.utils";
import { FoldersService } from "./folders.service";

export function createFilesResolver({ File, Scope: PassedScope }: { File: Type<FileInterface>; Scope?: Type<DamScopeInterface> }): Type<unknown> {
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

    @ScopeGuardActive(hasNonEmptyScope)
    @Resolver(() => File)
    class FilesResolver {
        constructor(
            private readonly filesService: FilesService,
            private readonly foldersService: FoldersService,
            @InjectRepository("DamFile") private readonly filesRepository: EntityRepository<FileInterface>,
            @InjectRepository("DamFolder") private readonly foldersRepository: EntityRepository<FolderInterface>,
            private readonly contentScopeService: ContentScopeService,
            @Inject(DAM_FILE_VALIDATION_SERVICE) private readonly fileValidationService: FileValidationService,
        ) {}

        @Query(() => PaginatedDamFiles)
        async damFilesList(@Args({ type: () => FileArgs }) args: FileArgsInterface): Promise<PaginatedDamFiles> {
            const [files, totalCount] = await this.filesService.findAndCount(args, nonEmptyScopeOrNothing(args.scope));
            return new PaginatedDamFiles(files, totalCount);
        }

        @Query(() => File)
        @SubjectEntity(File)
        async damFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const file = await this.filesService.findOneById(id);
            if (!file) {
                throw new NotFoundException(id);
            }
            return file;
        }

        @Query(() => [File])
        //@ SubjectEntity is not required here
        async findCopiesOfFileInScope(
            @Args({ type: () => FindCopiesOfFileInScopeArgs }) { id, scope, imageCropArea }: FindCopiesOfFileInScopeArgsInterface,
        ): Promise<FileInterface[]> {
            return this.filesService.findCopiesOfFileInScope(id, imageCropArea, scope);
        }

        @Mutation(() => File)
        @SubjectEntity(File)
        async updateDamFile(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => UpdateFileInput }) input: UpdateFileInput,
        ): Promise<FileInterface> {
            return this.filesService.updateById(id, input);
        }

        @Mutation(() => File)
        @SkipBuild()
        async importDamFileByDownload(
            @Args("url", { type: () => String }) url: string,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
            @Args("input", { type: () => UpdateFileInput }) { image: imageInput, ...input }: UpdateFileInput,
        ): Promise<FileInterface> {
            const file = await download(url);
            const validationResult = await this.fileValidationService.validateFile(file);
            if (validationResult !== undefined) {
                throw new CometValidationException(validationResult);
            }

            const uploadedFile = await this.filesService.upload(file, {
                ...input,
                imageCropArea: imageInput?.cropArea,
                folderId: input.folderId ? input.folderId : undefined,
                scope,
            });
            return uploadedFile;
        }

        @Mutation(() => [File])
        @SkipBuild()
        async moveDamFiles(
            @Args({ type: () => MoveDamFilesArgs }) { fileIds, targetFolderId }: MoveDamFilesArgs,
            @GetCurrentUser() user: CurrentUserInterface,
        ): Promise<FileInterface[]> {
            let targetFolder = null;
            if (targetFolderId !== null) {
                targetFolder = await this.foldersRepository.findOneOrFail(targetFolderId);

                if (targetFolder.scope !== undefined && !this.contentScopeService.canAccessScope(targetFolder.scope, user)) {
                    throw new Error("Can't access parent folder");
                }
            }

            const files = [];

            for (const id of fileIds) {
                const file = await this.filesRepository.findOneOrFail(id);

                if (file.scope !== undefined && !this.contentScopeService.canAccessScope(file.scope, user)) {
                    throw new Error("Can't access file");
                }

                files.push(file);
            }

            return this.filesService.moveBatch(files, targetFolder);
        }

        /**
         *  @deprecated Use copyFiles() instead
         */
        @Mutation(() => CopyFilesResponse, { deprecationReason: "Use copyFiles instead" })
        @SkipBuild()
        async copyFilesToScope(
            @GetCurrentUser() user: CurrentUserInterface,
            @Args("fileIds", { type: () => [ID] }) fileIds: string[],
            @Args("inboxFolderId", {
                type: () => ID,
            })
            inboxFolderId: string,
        ): Promise<CopyFilesResponseInterface> {
            return this.copyFiles(user, fileIds, inboxFolderId);
        }

        @Mutation(() => CopyFilesResponse)
        @SkipBuild()
        async copyFiles(
            @GetCurrentUser() user: CurrentUserInterface,
            @Args("fileIds", { type: () => [ID] }) fileIds: string[],
            @Args("targetFolderId", {
                type: () => ID,
                nullable: true,
            })
            targetFolderId: string | undefined,
            @Args("targetScope", {
                type: () => Scope,
                nullable: true,
                defaultValue: hasNonEmptyScope ? undefined : {},
                description: "Doesn't need to be set if targetFolderId is set",
            })
            targetScope?: typeof Scope,
        ): Promise<CopyFilesResponseInterface> {
            const targetFolder = targetFolderId ? await this.foldersService.findOneById(targetFolderId) : null;
            if (targetFolderId && !targetFolder) {
                throw new Error("Specified target folder doesn't exist.");
            }
            if (targetScope && targetFolder?.scope && !this.contentScopeService.scopesAreEqual(targetScope, targetFolder.scope)) {
                throw new Error("targetScope and targetFolder.scope don't match");
            }

            const scope = targetScope ?? targetFolder?.scope;
            if (scope && !this.contentScopeService.canAccessScope(scope, user)) {
                throw new Error("User can't access the target scope");
            }

            const files = await this.filesService.findMultipleByIds(fileIds);
            if (files.length === 0) {
                throw new Error("No valid file ids provided");
            }

            const getUniqueFileScopes = (files: FileInterface[]): DamScopeInterface[] => {
                const fileScopes: DamScopeInterface[] = [];
                for (const file of files) {
                    if (file.scope === undefined) {
                        continue;
                    }

                    const isDuplicateScope = Boolean(fileScopes.find((scope) => this.contentScopeService.scopesAreEqual(scope, file.scope)));
                    if (!isDuplicateScope) {
                        fileScopes.push(file.scope);
                    }
                }
                return fileScopes;
            };

            const fileScopes = getUniqueFileScopes(files);
            const canAccessFileScopes = fileScopes.every((scope) => {
                return this.contentScopeService.canAccessScope(scope, user);
            });
            if (!canAccessFileScopes) {
                throw new Error(`User can't access the scope of one or more files`);
            }

            const mappedFiles: Array<{ rootFile: FileInterface; copy: FileInterface }> = [];
            for (const file of files) {
                const copiedFile = await this.filesService.createCopyOfFile(file, {
                    inboxFolder: targetFolder,
                    scope: scope,
                });
                mappedFiles.push({ rootFile: file, copy: copiedFile });
            }

            return { mappedFiles };
        }

        @Mutation(() => File)
        @SubjectEntity(File)
        @SkipBuild()
        async archiveDamFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const entity = await this.filesRepository.findOneOrFail(id);
            entity.archived = true;

            await this.filesRepository.persistAndFlush(entity);
            return entity;
        }

        @Mutation(() => [File])
        @SkipBuild()
        async archiveDamFiles(@Args("ids", { type: () => [ID] }) ids: string[]): Promise<FileInterface[]> {
            const entities = await this.filesRepository.find({ id: { $in: ids } });

            for (const entity of entities) {
                entity.archived = true;
            }

            await this.filesRepository.flush();
            return entities;
        }

        @Mutation(() => File)
        @SubjectEntity(File)
        @SkipBuild()
        async restoreDamFile(@Args("id", { type: () => ID }) id: string): Promise<FileInterface> {
            const entity = await this.filesRepository.findOneOrFail(id);
            entity.archived = false;

            await this.filesRepository.persistAndFlush(entity);
            return entity;
        }

        @Mutation(() => [File])
        @SkipBuild()
        async restoreDamFiles(@Args("ids", { type: () => [ID] }) ids: string[]): Promise<FileInterface[]> {
            const entities = await this.filesRepository.find({ id: { $in: ids } });

            for (const entity of entities) {
                entity.archived = false;
            }

            await this.filesRepository.flush();
            return entities;
        }

        @Mutation(() => Boolean)
        @SubjectEntity(File)
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
        async fileUrl(@Parent() file: FileInterface): Promise<string> {
            return this.filesService.createFileUrl(file);
        }

        @ResolveField(() => [File])
        async duplicates(@Parent() file: FileInterface): Promise<FileInterface[]> {
            const files = await this.filesService.findAllByHash(file.contentHash);
            return files.filter((f) => f.id !== file.id);
        }

        @ResolveField(() => String)
        async damPath(@Parent() file: FileInterface): Promise<string> {
            return this.filesService.getDamPath(file);
        }
    }

    return FilesResolver;
}
