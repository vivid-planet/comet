import { Type } from "@nestjs/common";
import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { DisablePermissionCheck, RequiredPermission } from "../../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
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
    }
    return AuthResolver;
}
