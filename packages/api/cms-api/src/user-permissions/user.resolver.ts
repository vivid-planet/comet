import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { DisablePermissionCheck, RequiredPermission } from "./decorators/required-permission.decorator";
import { UserPermissionsPaginatedUserList } from "./dto/list-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermissionsService } from "./user-permissions.service";

@Resolver(() => User)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => User)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<User> {
        return this.userService.getUser(id);
    }

    @Query(() => UserPermissionsPaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs): Promise<UserPermissionsPaginatedUserList> {
        const [users, totalCount] = await this.userService.findUsers(args);
        return {
            ...new UserPermissionsPaginatedUserList(
                await Promise.all(
                    users.map(async (user) => {
                        return {
                            ...user,
                            permissionsCount: [...new Set((await this.userService.getPermissions(user)).map((p) => p.permission))].length,
                            contentScopesCount: [...new Set((await this.userService.getContentScopes(user)).map((c) => JSON.stringify(c)))].length,
                        };
                    }),
                ),
                totalCount,
            ),
            availablePermissionsCount: [...new Set(await this.userService.getAvailablePermissions())].length,
            availableContentScopesCount: [...new Set((await this.userService.getAvailableContentScopes()).map((c) => JSON.stringify(c)))].length,
        };
    }

    @Mutation(() => Boolean)
    @RequiredPermission("impersonation", { skipScopeCheck: true })
    async userPermissionsStartImpersonation(@Args("userId", { type: () => String }) userId: string, @Context() request: Request): Promise<boolean> {
        this.userService.setImpersonatedUser(userId, request);
        return true;
    }

    @Mutation(() => Boolean)
    @RequiredPermission(DisablePermissionCheck)
    async userPermissionsStopImpersonation(@Context() request: Request): Promise<boolean> {
        this.userService.unsetImpersonatedUser(request);
        return true;
    }
}
