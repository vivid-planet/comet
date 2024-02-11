import { Type } from "@nestjs/common";
import { Context, Mutation, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { CurrentUser } from "../../user-permissions/dto/current-user";
import { PublicApi } from "../decorators/public-api.decorator";

interface AuthResolverConfig {
    currentUser: Type<CurrentUser>;
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
}

export function createAuthResolver(config: AuthResolverConfig): Type<unknown> {
    @Resolver()
    @PublicApi()
    class AuthResolver {
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
