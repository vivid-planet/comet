import { NotFoundException } from "@nestjs/common";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { FolderArgs, FolderByNameAndParentIdArgs } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { Folder } from "./entities/folder.entity";
import { FoldersService } from "./folders.service";

@Resolver(() => Folder)
export class FoldersResolver {
    constructor(private readonly foldersService: FoldersService) {}

    @Query(() => [Folder])
    async damFoldersList(@Args() args: FolderArgs): Promise<Folder[]> {
        return this.foldersService.findAll(args);
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
    async createDamFolder(@Args("input", { type: () => CreateFolderInput }) data: CreateFolderInput): Promise<Folder> {
        return this.foldersService.create(data);
    }

    @Mutation(() => Folder)
    async updateDamFolder(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => UpdateFolderInput }) input: UpdateFolderInput,
    ): Promise<Folder> {
        return this.foldersService.updateById(id, input);
    }

    @Mutation(() => Boolean)
    async deleteDamFolder(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        return this.foldersService.delete(id);
    }

    @ResolveField(() => [Folder])
    async parents(@Parent() folder: Folder): Promise<Folder[]> {
        return this.foldersService.findAncestorsByMaterializedPath(folder.mpath);
    }
}
