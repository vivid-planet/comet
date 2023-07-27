import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { NotFoundException, Type } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { basename, extname } from "path";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { SkipBuild } from "../../builds/skip-build.decorator";
import { SubjectEntity } from "../../common/decorators/subject-entity.decorator";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { ContentScopeService } from "../../content-scope/content-scope.service";
import { ScopeGuardActive } from "../../content-scope/decorators/scope-guard-active.decorator";
import { DependentsResolver } from "../../dependencies/dependencies.resolver";
import { DependenciesService } from "../../dependencies/dependencies.service";
import { PageTreeService } from "../../page-tree/page-tree.service";
import { DamScopeInterface } from "../types";
import { CopyFilesResponseInterface, createCopyFilesTypes } from "./dto/copyFiles.types";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createFileArgs, FileArgsInterface, MoveDamFilesArgs } from "./dto/file.args";
import { UpdateFileInput } from "./dto/file.input";
import { FilenameInput, FilenameResponse } from "./dto/filename.args";
import { FILE_ENTITY, FileInterface } from "./entities/file.entity";
import { FolderInterface } from "./entities/folder.entity";
import { FilesService } from "./files.service";
import { slugifyFilename } from "./files.utils";

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
    const { CopyFilesResponse } = createCopyFilesTypes({ File });

    @ObjectType()
    class PaginatedDamFiles extends PaginatedResponseFactory.create(File) {}

    @ScopeGuardActive(hasNonEmptyScope)
    @Resolver(() => File)
    class FilesResolver extends DependentsResolver(File) {
        constructor(
            private readonly filesService: FilesService,
            @InjectRepository("File") private readonly filesRepository: EntityRepository<FileInterface>,
            @InjectRepository("Folder") private readonly foldersRepository: EntityRepository<FolderInterface>,
            private readonly contentScopeService: ContentScopeService,
            private readonly dependenciesService: DependenciesService,
            private readonly pageTreeService: PageTreeService,
        ) {
            super(dependenciesService);
        }

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

        @Mutation(() => File)
        @SubjectEntity(File)
        async updateDamFile(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => UpdateFileInput }) input: UpdateFileInput,
        ): Promise<FileInterface> {
            return this.filesService.updateById(id, input);
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

        @Query(() => [File])
        async getAllFilesUsedOnPage(@Args("pageTreeNodeId", { type: () => ID }) pageTreeNodeId: string): Promise<FileInterface[]> {
            const node = await this.pageTreeService.createReadApi().getNode(pageTreeNodeId);

            if (node === null) {
                throw new Error("PageTreeNode not found");
            }

            const document = await this.pageTreeService.getActiveAttachedDocument(node.id, node.documentType);

            if (document === null) {
                return [];
            }

            await this.dependenciesService.refreshViews();
            const dependencies = await this.dependenciesService.getDependencies(
                { entityName: document.type, id: document.documentId },
                { targetEntityName: FILE_ENTITY },
            );

            const fileIds = dependencies.map((dependency) => dependency.targetId);
            return this.filesService.findMultipleByIds(fileIds);
        }

        @Mutation(() => CopyFilesResponse)
        @SkipBuild()
        async copyFilesToScope(
            @Args("fileIds", { type: () => [ID] }) fileIds: string[],
            @Args("targetScope", { type: () => Scope }) targetScope: typeof Scope,
            @Args("targetFolderId", {
                type: () => ID,
                nullable: true,
                description:
                    "You can set this argument to use the same inbox folder for multiple consecutive copy operations. Keep it empty for the first copy operation and get the ID from the response.",
            })
            targetFolderId?: string,
        ): Promise<CopyFilesResponseInterface> {
            return this.filesService.copyFilesToScope({ fileIds, targetScope, targetFolderId });
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
