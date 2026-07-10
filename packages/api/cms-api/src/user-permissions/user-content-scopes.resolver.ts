import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import isEqual from "lodash.isequal";

import { SkipBuild } from "../builds/skip-build.decorator";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { ContentScopeDimension, ContentScopeWithLabel } from "./dto/content-scope";
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
        private readonly entityManager: EntityManager,
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
        await this.entityManager.persistAndFlush(entity);
        return true;
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
    ): Promise<ContentScope[]> {
        const user = await this.userService.findUserOrThrow(userId);
        const contentScopes = await this.userService.getContentScopes(user, !skipManual);
        const availableContentScopes = await this.userService.getAvailableContentScopes();
        const contentScopesFromAvailable = availableContentScopes
            .filter((availableContentScope) => contentScopes.some((contentScope) => isEqual(contentScope, availableContentScope.scope)))
            .map((availableContentScope) => availableContentScope.scope);
        // Wildcard scopes are valid grants that are not part of the available content scopes, so they are kept as-is
        const wildcardContentScopes = contentScopes.filter((contentScope) =>
            Object.values(contentScope as Record<string, unknown>).includes(UserPermissions.allValues),
        );
        const result = [...contentScopesFromAvailable, ...wildcardContentScopes];

        // A user with all content scopes also has all values for dimensions that are not part of the available content scopes
        // (e.g. an optional dimension). Show those as the all-values wildcard. Not applied to skipManual, which is used to
        // detect rule-based scopes when manually assigning scopes.
        if (!skipManual && (await this.userService.hasAllContentScopes(user))) {
            const enumerableDimensions = new Set(availableContentScopes.flatMap((availableContentScope) => Object.keys(availableContentScope.scope)));
            const wildcardDimensions = (await this.userService.getAvailableContentScopeDimensions())
                .map((dimension) => dimension.name)
                .filter((name) => !enumerableDimensions.has(name));
            if (wildcardDimensions.length > 0) {
                return result.map((scope) => ({
                    ...scope,
                    ...Object.fromEntries(wildcardDimensions.map((name) => [name, UserPermissions.allValues])),
                }));
            }
        }

        return result;
    }

    @Query(() => [ContentScopeWithLabel])
    async userPermissionsAvailableContentScopes(): Promise<ContentScopeWithLabel[]> {
        return this.userService.getAvailableContentScopes();
    }

    @Query(() => [ContentScopeDimension])
    async userPermissionsAvailableContentScopeDimensions(): Promise<ContentScopeDimension[]> {
        return this.userService.getAvailableContentScopeDimensions();
    }
}
