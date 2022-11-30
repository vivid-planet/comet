import { forwardRef, Inject, Type } from "@nestjs/common";
import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { AUTH_CONFIG, AUTH_MODULE_CONFIG } from "./auth.constants";
import { AuthConfig, AuthModuleConfig } from "./auth.module";
import { GetCurrentUser } from "./decorators/get-current-user.decorator";

export function createAuthResolver<CurrentUser>(CurrentUser: Type<CurrentUser>): Type<unknown> {
    @Resolver(() => CurrentUser)
    class AuthResolver {
        constructor(
            @Inject(forwardRef(() => AUTH_MODULE_CONFIG)) private readonly moduleConfig: AuthModuleConfig<CurrentUser>,
            @Inject(forwardRef(() => AUTH_CONFIG)) private readonly config: AuthConfig<CurrentUser>,
        ) {}

        @Query(() => CurrentUser)
        async currentUser(@GetCurrentUser() user: typeof CurrentUser): Promise<typeof CurrentUser> {
            return user;
        }

        @Mutation(() => String)
        async currentUserSignOut(@Context("req") req: IncomingMessage): Promise<string | null> {
            let redirectUri = this.moduleConfig.postLogoutRedirectUri || "/";

            if (req.headers["authorization"] && this.config.endSessionEndpoint) {
                const url = new URL(this.config.endSessionEndpoint);
                url.search = new URLSearchParams({
                    id_token_hint: req.headers["authorization"].substring(7),
                    post_logout_redirect_uri: redirectUri,
                }).toString();
                redirectUri = url.toString();
            }
            return `/oauth2/sign_out?rd=${encodeURIComponent(redirectUri)}`;
        }
    }
    return AuthResolver;
}
