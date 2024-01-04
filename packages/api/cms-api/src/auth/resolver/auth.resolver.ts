import { Type } from "@nestjs/common";
import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { CurrentUserInterface } from "../current-user/current-user";
import { GetCurrentUser } from "../decorators/get-current-user.decorator";
import { PublicApi } from "../decorators/public-api.decorator";

interface AuthResolverConfig {
    currentUser: Type<CurrentUserInterface>;
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
}

export function createAuthResolver(config: AuthResolverConfig): Type<unknown> {
    @Resolver(() => config.currentUser)
    @PublicApi()
    class AuthResolver {
        @Query(() => config.currentUser)
        async currentUser(@GetCurrentUser() user: typeof config.currentUser): Promise<typeof config.currentUser> {
            return user;
        }

        @Mutation(() => String)
        @SkipBuild()
        async currentUserSignOut(@Context("req") req: IncomingMessage): Promise<string | null> {
            let signOutUrl = config.postLogoutRedirectUri || "/";

            if (req.headers["authorization"] && config.endSessionEndpoint) {
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
