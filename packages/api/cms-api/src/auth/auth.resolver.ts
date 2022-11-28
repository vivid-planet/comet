import { Type } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "./decorators/get-current-user.decorator";

export function createAuthAuthedUserResolver<CurrentUser>(CurrentUser: Type<CurrentUser>): Type<unknown> {
    @Resolver(() => CurrentUser)
    class AuthedUserResolver {
        @Query(() => CurrentUser)
        async currentUser(@GetCurrentUser() user: typeof CurrentUser): Promise<typeof CurrentUser> {
            return user;
        }

        @Mutation(() => String)
        currentUserSignOut(): string {
            return "/";
        }
    }
    return AuthedUserResolver;
}
