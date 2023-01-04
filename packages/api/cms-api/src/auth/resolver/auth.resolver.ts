import { Inject, Type } from "@nestjs/common";
import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { CurrentUserInterface } from "../current-user/current-user";
import { GetCurrentUser } from "../decorators/get-current-user.decorator";

export interface AuthResolverConfig {
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
}

export const AUTH_RESOLVER_CONFIG = "auth-resolver-config";

export function createAuthResolver(currentUser: Type<CurrentUserInterface>): Type<unknown> {
    @Resolver(() => currentUser)
    class AuthResolver {
        constructor(@Inject(AUTH_RESOLVER_CONFIG) private readonly config: AuthResolverConfig) {}

        @Query(() => currentUser)
        async currentUser(@GetCurrentUser() user: typeof currentUser): Promise<typeof currentUser> {
            return user;
        }

        @Mutation(() => String)
        async currentUserSignOut(@Context("req") req: IncomingMessage): Promise<string | null> {
            let signOutUrl = (this.config && this.config.postLogoutRedirectUri) || "/";

            if (req.headers["authorization"] && this.config && this.config.endSessionEndpoint) {
                const url = new URL(this.config.endSessionEndpoint);
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
