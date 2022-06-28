import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { NotFoundException } from "@nestjs/common";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { FileArgs } from "./dto/file.args";
import { UpdateFileInput } from "./dto/file.input";
import { File } from "./entities/file.entity";
import { FilesService, withFilesSelect } from "./files.service";

@Resolver(() => File)
export class FilesResolver {
    constructor(private readonly filesService: FilesService, @InjectRepository(File) private readonly filesRepository: EntityRepository<File>) {}

    @Query(() => [File])
    async damFilesList(@Args() args: FileArgs): Promise<File[]> {
        return this.filesService.findAll(args);
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
    async moveDamFiles(
        @Args("fileIds", { type: () => [ID] }) fileIds: string[],
        @Args("targetFolderId", { type: () => ID, nullable: true }) targetFolderId: string,
    ): Promise<File[]> {
        return this.filesService.moveBatch(fileIds, targetFolderId);
    }

    @Mutation(() => File)
    async archiveDamFile(@Args("id", { type: () => ID }) id: string): Promise<File> {
        const entity = await this.filesRepository.findOneOrFail(id);
        entity.archived = true;

        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    @Mutation(() => File)
    async restoreDamFile(@Args("id", { type: () => ID }) id: string): Promise<File> {
        const entity = await this.filesRepository.findOneOrFail(id);
        entity.archived = false;

        await this.filesRepository.persistAndFlush(entity);
        return entity;
    }

    @Mutation(() => Boolean)
    async deleteDamFile(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        return this.filesService.delete(id);
    }

    @Query(() => Boolean)
    async damFilenameAlreadyExists(@Args("filename") filename: string, @Args("folderId", { nullable: true }) folderId?: string): Promise<boolean> {
        return (
            (
                await withFilesSelect(this.filesRepository.createQueryBuilder("file"), {
                    filename,
                    folderId: folderId || null,
                }).getResult()
            ).length > 0
        );
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
        return await this.filesService.getDamPath(file);
    }
}
