import { Type } from "@nestjs/common";
import { Args, ArgsType, Context, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import crypto from "crypto";
import { IncomingMessage } from "http";

import { SkipBuild } from "../../builds/skip-build.decorator";
import { CurrentUserInterface } from "../current-user/current-user";
import { GetCurrentUser } from "../decorators/get-current-user.decorator";

interface AuthResolverConfig {
    currentUser: Type<CurrentUserInterface>;
    endSessionEndpoint?: string;
    postLogoutRedirectUri?: string;
    hmacSecret: string;
}

@ObjectType()
@ArgsType()
class Hmac {
    @Field(() => Number)
    @IsNumber()
    timestamp: number;

    @Field(() => String)
    @IsString()
    hash: string;
}

export function createAuthResolver(config: AuthResolverConfig): Type<unknown> {
    @Resolver(() => config.currentUser)
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

        @Query(() => Hmac)
        hmacCreate(): Hmac {
            const timestamp = Math.floor(Date.now() / 1000);
            return {
                timestamp,
                hash: this.createHash(timestamp),
            };
        }

        @Query(() => Boolean)
        hmacValidate(@Args() args: Hmac): boolean {
            // Timestamp must be within the last 5 minutes
            if (args.timestamp < Math.floor(Date.now() / 1000) - 60 * 5) {
                return false;
            }
            return this.createHash(args.timestamp) === args.hash;
        }

        private createHash(timestamp: number): string {
            if (!timestamp) throw new Error("Timestamp is required");
            return crypto
                .createHmac("sha256", config.hmacSecret)
                .update(timestamp + config.hmacSecret)
                .digest("hex");
        }
    }
    return AuthResolver;
}
