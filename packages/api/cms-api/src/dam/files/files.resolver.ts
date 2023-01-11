import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { NotFoundException } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { basename, extname } from "path";

import { BlockIndexService } from "../../blocks/block-index.service";
import { BlockIndexDependency } from "../../blocks/block-index-dependency";
import { DAM_FILE_BLOCK_INDEX_IDENTIFIER } from "../../blocks/block-index-identifiers";
import { SkipBuild } from "../../builds/skip-build.decorator";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { FileArgs } from "./dto/file.args";
import { UpdateFileInput } from "./dto/file.input";
import { FilenameInput, FilenameResponse } from "./dto/filename.args";
import { File } from "./entities/file.entity";
import { FilesService } from "./files.service";
import { slugifyFilename } from "./files.utils";

@ObjectType()
export class PaginatedDamFiles extends PaginatedResponseFactory.create(File) {}

@Resolver(() => File)
export class FilesResolver {
    constructor(
        private readonly filesService: FilesService,
        @InjectRepository(File) private readonly filesRepository: EntityRepository<File>,
        private readonly blockIndexService: BlockIndexService,
    ) {}

    @Query(() => PaginatedDamFiles)
    async damFilesList(@Args() args: FileArgs): Promise<PaginatedDamFiles> {
        const [files, totalCount] = await this.filesService.findAndCount(args);
        return new PaginatedDamFiles(files, totalCount);
    }

    @Query(() => File)
    async damFile(@Args("id", { type: () => ID }) id: string): Promise<File> {
        const file = await this.filesService.findOneById(id);
        if (!file) {
            throw new NotFoundException(id);
        }
        return file;
    }

    @Mutation(() => File)
    async updateDamFile(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => UpdateFileInput }) input: UpdateFileInput,
    ): Promise<File> {
        return this.filesService.updateById(id, input);
    }

    @Mutation(() => [File])
    @SkipBuild()
    async moveDamFiles(
        @Args("fileIds", { type: () => [ID] }) fileIds: string[],
        @Args("targetFolderId", { type: () => ID, nullable: true }) targetFolderId: string,
    ): Promise<File[]> {
        return this.filesService.moveBatch(fileIds, targetFolderId);
    }

    @Mutation(() => File)
    @SkipBuild()
    async archiveDamFile(@Args("id", { type: () => ID }) id: string): Promise<File> {
        const entity = await this.filesRepository.findOneOrFail(id);
        entity.archived = true;

        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    @Mutation(() => File)
    @SkipBuild()
    async restoreDamFile(@Args("id", { type: () => ID }) id: string): Promise<File> {
        const entity = await this.filesRepository.findOneOrFail(id);
        entity.archived = false;

        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    @Mutation(() => Boolean)
    @SkipBuild()
    async deleteDamFile(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        return this.filesService.delete(id);
    }

    @Query(() => Boolean)
    async damIsFilenameOccupied(@Args("filename") filename: string, @Args("folderId", { nullable: true }) folderId?: string): Promise<boolean> {
        const extension = extname(filename);
        const name = basename(filename, extension);
        const slugifiedName = slugifyFilename(name, extension);

        return (await this.filesService.findOneByFilenameAndFolder(slugifiedName, folderId)) !== null;
    }

    @Query(() => [FilenameResponse])
    async damAreFilenamesOccupied(
        @Args("filenames", { type: () => [FilenameInput] }) filenames: Array<FilenameInput>,
    ): Promise<Array<FilenameResponse>> {
        const response: Array<FilenameResponse> = [];

        for (const { name, folderId } of filenames) {
            const extension = extname(name);
            const filename = basename(name, extension);
            const slugifiedName = slugifyFilename(filename, extension);

            const existingFile = await this.filesService.findOneByFilenameAndFolder(slugifiedName, folderId);
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
    async fileUrl(@Parent() file: File): Promise<string> {
        return this.filesService.createFileUrl(file);
    }

    @ResolveField(() => [File])
    async duplicates(@Parent() file: File): Promise<File[]> {
        const files = await this.filesService.findAllByHash(file.contentHash);
        return files.filter((f) => f.id !== file.id);
    }

    @ResolveField(() => String)
    async damPath(@Parent() file: File): Promise<string> {
        return this.filesService.getDamPath(file);
    }

    @ResolveField(() => [BlockIndexDependency])
    async dependents(@Parent() file: File): Promise<BlockIndexDependency[]> {
        const dependents = await this.blockIndexService.getDependentsByTargetIdentifierAndTargetId(DAM_FILE_BLOCK_INDEX_IDENTIFIER, file.id);
        console.log("dependents ", dependents);
        return dependents;
    }
}
