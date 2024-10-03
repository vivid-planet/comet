import { Inject, Type } from "@nestjs/common";
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";
import { IncomingMessage } from "http";
import isEqual from "lodash.isequal";
import uniqWith from "lodash.uniqwith";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { DisablePermissionCheck, RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";
import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { UserPermissionsService } from "../../user-permissions/user-permissions.service";
import { AccessControlServiceInterface, ContentScopeWithLabel } from "../../user-permissions/user-permissions.types";
import { GetCurrentUser } from "../decorators/get-current-user.decorator";

interface AuthResolverConfig {
    currentUser?: Type<CurrentUser>; // TODO Remove in future version as it is not used and here for backwards compatibility
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
}

export function createAuthResolver(config?: AuthResolverConfig): Type<unknown> {
    @Resolver(() => CurrentUser)
    @RequiredPermission(DisablePermissionCheck)
    class AuthResolver {
        constructor(
            @Inject(ACCESS_CONTROL_SERVICE) private accessControlService: AccessControlServiceInterface,
            private readonly service: UserPermissionsService,
        ) {}

        @Query(() => CurrentUser)
        async currentUser(@GetCurrentUser() user: CurrentUser): Promise<CurrentUser> {
            return user;
        }

        @Mutation(() => String)
        @SkipBuild()
        async currentUserSignOut(@Context("req") req: IncomingMessage): Promise<string | null> {
            let signOutUrl = config?.postLogoutRedirectUri || "/";

            if (req.headers["authorization"] && config?.endSessionEndpoint) {
                const url = new URL(config.endSessionEndpoint);
                url.search = new URLSearchParams({
                    id_token_hint: req.headers["authorization"].substring(7),
                    post_logout_redirect_uri: signOutUrl,
                }).toString();
                signOutUrl = url.toString();
            }
            return signOutUrl;
        }

        @ResolveField(() => [String])
        permissionsForScope(@Parent() user: CurrentUser, @Args("scope", { type: () => GraphQLJSONObject }) scope: ContentScope): string[] {
            return user.permissions.map((p) => p.permission).filter((permission) => this.accessControlService.isAllowed(user, permission, scope));
        }

        @ResolveField(() => [GraphQLJSONObject])
        allowedContentScopes(@Parent() user: CurrentUser): ContentScope[] {
            return uniqWith(
                user.permissions.flatMap((p) => p.contentScopes),
                isEqual,
            );
        }

        @ResolveField(() => [GraphQLJSONObject])
        async allowedContentScopesWithLabels(@Parent() user: CurrentUser): Promise<ContentScopeWithLabel[]> {
            const allowedContentScopes = this.allowedContentScopes(user);
            return (await this.service.getAvailableContentScopesWithLabels()).filter((contentScopeWithLabels) =>
                allowedContentScopes.some((allowedContentScope) =>
                    isEqual(
                        Object.fromEntries(Object.entries<{ value: string }>(contentScopeWithLabels).map(([key, value]) => [key, value.value])),
                        allowedContentScope,
                    ),
                ),
            );
        }
    }
    return AuthResolver;
}
