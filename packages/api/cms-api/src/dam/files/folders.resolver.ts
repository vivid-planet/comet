import { NotFoundException, Type } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { SubjectEntity } from "../../common/decorators/subject-entity.decorator";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { ScopeGuardActive } from "../../content-scope/decorators/scope-guard-active.decorator";
import { DamScopeInterface } from "../types";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createFolderArgs, createFolderByNameAndParentIdArgs, FolderArgsInterface, FolderByNameAndParentIdArgsInterface } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { FolderInterface } from "./entities/folder.entity";
import { FoldersService } from "./folders.service";

export function createFoldersResolver({
    Folder,
    Scope: PassedScope,
}: {
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

    const FolderArgs = createFolderArgs({ Scope });
    const FolderByNameAndParentIdArgs = createFolderByNameAndParentIdArgs({ Scope });

    @ObjectType()
    class PaginatedDamFolders extends PaginatedResponseFactory.create(Folder) {}

    @ScopeGuardActive(hasNonEmptyScope)
    @Resolver(() => Folder)
    class FoldersResolver {
        constructor(private readonly foldersService: FoldersService) {}

        @Query(() => [Folder])
        async damFoldersFlat(
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
        ): Promise<FolderInterface[]> {
            return this.foldersService.findAllFlat(nonEmptyScopeOrNothing(scope));
        }

        @Query(() => PaginatedDamFolders)
        async damFoldersList(@Args({ type: () => FolderArgs }) args: FolderArgsInterface): Promise<PaginatedDamFolders> {
            const [folders, totalCount] = await this.foldersService.findAndCount(args, nonEmptyScopeOrNothing(args.scope));
            return new PaginatedDamFolders(folders, totalCount);
        }

        @Query(() => Folder)
        @SubjectEntity(Folder)
        async damFolder(@Args("id", { type: () => ID }) id: string): Promise<FolderInterface> {
            const folder = await this.foldersService.findOneById(id);
            if (!folder) {
                throw new NotFoundException(id);
            }
            return folder;
        }

        @Query(() => Folder, { nullable: true })
        async damFolderByNameAndParentId(
            @Args({ type: () => FolderByNameAndParentIdArgs }) args: FolderByNameAndParentIdArgsInterface,
        ): Promise<FolderInterface | null> {
            return this.foldersService.findOneByNameAndParentId(args, nonEmptyScopeOrNothing(args.scope));
        }

        @Mutation(() => Folder)
        @SkipBuild()
        async createDamFolder(
            @Args("input", { type: () => CreateFolderInput }) input: CreateFolderInput,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
        ): Promise<FolderInterface> {
            return this.foldersService.create(input, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => Folder)
        @SubjectEntity(Folder)
        @SkipBuild()
        async updateDamFolder(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => UpdateFolderInput }) input: UpdateFolderInput,
        ): Promise<FolderInterface> {
            return this.foldersService.updateById(id, input);
        }

        @Mutation(() => [Folder])
        @SkipBuild()
        async moveDamFolders(
            @Args("folderIds", { type: () => [ID] }) folderIds: string[],
            @Args("targetFolderId", { type: () => ID, nullable: true }) targetFolderId: string,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
        ): Promise<FolderInterface[]> {
            return this.foldersService.moveBatch({ folderIds, targetFolderId }, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => Boolean)
        @SubjectEntity(Folder)
        @SkipBuild()
        async deleteDamFolder(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            return this.foldersService.delete(id);
        }

        @ResolveField(() => [Folder])
        async parents(@Parent() folder: FolderInterface): Promise<FolderInterface[]> {
            return this.foldersService.findAncestorsByMaterializedPath(folder.mpath);
        }
    }

    return FoldersResolver;
}
