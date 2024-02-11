import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { PublicApi } from "../auth/decorators/public-api.decorator";
import { SkipBuild } from "../builds/skip-build.decorator";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { UserContentScopesInput } from "./dto/user-content-scopes.input";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { UserPermissionsService } from "./user-permissions.service";
import { UserPermissions } from "./user-permissions.types";

@Resolver()
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserContentScopesResolver {
    constructor(
        @InjectRepository(UserContentScopes) private readonly repository: EntityRepository<UserContentScopes>,
        private readonly userService: UserPermissionsService,
    ) {}

    @Mutation(() => Boolean)
    @SkipBuild()
    async userPermissionsUpdateContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("input", { type: () => UserContentScopesInput }) { contentScopes }: UserContentScopesInput,
    ): Promise<boolean> {
        await this.userService.checkContentScopes(contentScopes);
        let entity = await this.repository.findOne({ userId });
        if (entity) {
            entity = this.repository.assign(entity, { userId, contentScopes });
        } else {
            entity = this.repository.create({ userId, contentScopes });
        }
        await this.repository.persistAndFlush(entity);
        return true;
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
    ): Promise<ContentScope[]> {
        const contentScopes = await this.userService.getContentScopes(userId, !skipManual);
        const availableContentScopes = await this.userService.getAvailableContentScopes();
        if (contentScopes === UserPermissions.allContentScopes) return availableContentScopes;
        return this.userService.normalizeContentScopes(contentScopes, availableContentScopes);
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsAvailableContentScopes(): Promise<ContentScope[]> {
        return this.userService.getAvailableContentScopes();
    }

    @Query(() => [GraphQLJSONObject])
    @PublicApi()
    async currentUserContentScopes(@GetCurrentUser() user: CurrentUser): Promise<ContentScope[]> {
        const availableContentScopes = await this.userService.getAvailableContentScopes();
        if (!user.contentScopes) {
            return availableContentScopes;
        } else {
            return this.userService.normalizeContentScopes(
                [...user.contentScopes, ...user.permissions.flatMap((p) => p.contentScopes || [])],
                availableContentScopes,
            );
        }
    }
}
