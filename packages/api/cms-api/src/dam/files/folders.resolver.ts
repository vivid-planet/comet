import { NotFoundException } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { AllFoldersArgs, FolderArgs, FolderByNameAndParentIdArgs } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { Folder } from "./entities/folder.entity";
import { FoldersService } from "./folders.service";

@ObjectType()
export class PaginatedDamFolders extends PaginatedResponseFactory.create(Folder) {}

@Resolver(() => Folder)
export class FoldersResolver {
    constructor(private readonly foldersService: FoldersService) {}

    @Query(() => [Folder])
    async damFolders(@Args() args: AllFoldersArgs): Promise<Folder[]> {
        return this.foldersService.findAll(args);
    }

    @Query(() => PaginatedDamFolders)
    async damFoldersList(@Args() args: FolderArgs): Promise<PaginatedDamFolders> {
        const [folders, totalCount] = await this.foldersService.findAndCount(args);
        return new PaginatedDamFolders(folders, totalCount);
    }

    @Query(() => Folder)
    async damFolder(@Args("id", { type: () => ID }) id: string): Promise<Folder> {
        const folder = await this.foldersService.findOneById(id);
        if (!folder) {
            throw new NotFoundException(id);
        }
        return folder;
    }

    @Query(() => Folder, { nullable: true })
    async damFolderByNameAndParentId(@Args() args: FolderByNameAndParentIdArgs): Promise<Folder | null> {
        return this.foldersService.findOneByNameAndParentId(args.name, args.parentId);
    }

    @Mutation(() => Folder)
    @SkipBuild()
    async createDamFolder(@Args("input", { type: () => CreateFolderInput }) data: CreateFolderInput): Promise<Folder> {
        return this.foldersService.create(data);
    }

    @Mutation(() => Folder)
    @SkipBuild()
    async updateDamFolder(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => UpdateFolderInput }) input: UpdateFolderInput,
    ): Promise<Folder> {
        return this.foldersService.updateById(id, input);
    }

    @Mutation(() => [Folder])
    @SkipBuild()
    async moveDamFolders(
        @Args("folderIds", { type: () => [ID] }) folderIds: string[],
        @Args("targetFolderId", { type: () => ID, nullable: true }) targetFolderId: string,
    ): Promise<Folder[]> {
        return this.foldersService.moveBatch(folderIds, targetFolderId);
    }

    @Mutation(() => Boolean)
    @SkipBuild()
    async deleteDamFolder(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        return this.foldersService.delete(id);
    }

    @ResolveField(() => [Folder])
    async parents(@Parent() folder: Folder): Promise<Folder[]> {
        return this.foldersService.findAncestorsByMaterializedPath(folder.mpath);
    }
}
