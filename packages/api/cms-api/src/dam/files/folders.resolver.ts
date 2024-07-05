import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { ForbiddenException, Inject, NotFoundException, Type } from "@nestjs/common";
import { Args, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../../auth/decorators/get-current-user.decorator";
import { SkipBuild } from "../../builds/skip-build.decorator";
import { PaginatedResponseFactory } from "../../common/pagination/paginated-response.factory";
import { AffectedEntity } from "../../user-permissions/decorators/affected-entity.decorator";
import { RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { DamScopeInterface } from "../types";
import { EmptyDamScope } from "./dto/empty-dam-scope";
import { createFolderArgs, createFolderByNameAndParentIdArgs, FolderArgsInterface, FolderByNameAndParentIdArgsInterface } from "./dto/folder.args";
import { CreateFolderInput, UpdateFolderInput } from "./dto/folder.input";
import { SHARED_FOLDER_NAME } from "./entities/folder.constants";
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

    @RequiredPermission(["dam"], { skipScopeCheck: !hasNonEmptyScope })
    @Resolver(() => Folder)
    class FoldersResolver {
        constructor(
            private readonly foldersService: FoldersService,
            @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
            @InjectRepository("DamFolder") private readonly foldersRepository: EntityRepository<FolderInterface>,
        ) {}

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
        @RequiredPermission(["dam"], { skipScopeCheck: true }) // Custom scope check to handle the shared folder's fake scope
        async damFolder(@Args("id", { type: () => ID }) id: string, @GetCurrentUser() user: CurrentUser): Promise<FolderInterface> {
            const folder = await this.foldersService.findOneById(id);
            if (!folder) {
                throw new NotFoundException(id);
            }

            if (folder.scope) {
                if (this.accessControlService.isAllowed(user, "dam", folder.scope) || folder.isSharedBetweenAllScopes) {
                    return folder;
                } else {
                    throw new ForbiddenException();
                }
            } else {
                return folder;
            }
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
            if (input.name === SHARED_FOLDER_NAME) {
                if (nonEmptyScopeOrNothing(scope) === undefined) {
                    throw new Error("Can't create a shared folder if the DAM isn't scoped");
                }

                return this.foldersService.createSharedFolder({ scope: nonEmptyScopeOrNothing(scope) });
            }

            return this.foldersService.create({ ...input }, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => Folder)
        @AffectedEntity(Folder)
        @SkipBuild()
        async updateDamFolder(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => UpdateFolderInput }) input: UpdateFolderInput,
        ): Promise<FolderInterface> {
            const folder = await this.foldersRepository.findOneOrFail({ id });
            if (folder?.isSharedBetweenAllScopes) {
                throw new Error("Can't edit shared folder");
            }

            return this.foldersService.updateById(id, input);
        }

        @Mutation(() => [Folder])
        @SkipBuild()
        async moveDamFolders(
            @Args("folderIds", { type: () => [ID] }) folderIds: string[],
            @Args("targetFolderId", { type: () => ID, nullable: true }) targetFolderId: string,
            @Args("scope", { type: () => Scope, defaultValue: hasNonEmptyScope ? undefined : {} }) scope: typeof Scope,
        ): Promise<FolderInterface[]> {
            const sharedFolder = await this.foldersRepository.findOneOrFail({ isSharedBetweenAllScopes: true });
            if (folderIds.includes(sharedFolder.id)) {
                throw new Error("Can't move shared folder");
            }

            return this.foldersService.moveBatch({ folderIds, targetFolderId }, nonEmptyScopeOrNothing(scope));
        }

        @Mutation(() => Boolean)
        @AffectedEntity(Folder)
        @SkipBuild()
        async deleteDamFolder(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const folder = await this.foldersRepository.findOneOrFail({ id });
            if (folder?.isSharedBetweenAllScopes) {
                throw new Error("Can't delete shared folder");
            }

            return this.foldersService.delete(id);
        }

        @ResolveField(() => [Folder])
        async parents(@Parent() folder: FolderInterface): Promise<FolderInterface[]> {
            return this.foldersService.findAncestorsByMaterializedPath(folder.mpath);
        }
    }

    return FoldersResolver;
}
