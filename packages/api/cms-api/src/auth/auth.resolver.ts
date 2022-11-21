import { forwardRef, Inject, Type } from "@nestjs/common";
import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { JWT_CONFIG } from "./auth.constants";
import { JwtConfig } from "./auth.module";
import { GetCurrentUser } from "./decorators/get-current-user.decorator";
import { CurrentUser } from "./dto/current-user.dto";

export function createAuthResolver(CurrentUser: Type<CurrentUser>): Type<unknown> {
    @Resolver(() => CurrentUser)
    class AuthResolver {
        constructor(@Inject(forwardRef(() => JWT_CONFIG)) private config: JwtConfig) {}

        @Query(() => CurrentUser)
        async me(@GetCurrentUser() user: CurrentUser): Promise<CurrentUser> {
            return user;
        }

        @Mutation(() => String)
        async signOut(@Context("req") req: IncomingMessage): Promise<string> {
            let redirectUri = this.config.postLogoutRedirectUri || "/";

            if (req.headers["authorization"] && this.config.endSessionEndpoint) {
                const url = new URL(this.config.endSessionEndpoint);
                url.search = new URLSearchParams({
                    id_token_hint: req.headers["authorization"].substring(7),
                    post_logout_redirect_uri: redirectUri,
                }).toString();
                redirectUri = url.toString();
            }

            return `/oauth2/sign_out?rd=${encodeURIComponent("/")}`;
        }
    }
    return AuthResolver;
}
