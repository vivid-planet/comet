import { Args, Int, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { AbstractAccessControlService } from "./access-control.service";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { UserPermissionsUser } from "./dto/user";
import { User } from "./interfaces/user";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
class UserPermissionPaginatedUserList extends PaginatedResponseFactory.create(UserPermissionsUser) {}

@Resolver(() => UserPermissionsUser)
@RequiredPermission(["userPermissions", "impersonation"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => UserPermissionsUser)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<UserPermissionsUser> {
        return this.userService.getUser(id);
    }

    @Query(() => UserPermissionPaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs): Promise<UserPermissionPaginatedUserList> {
        const permissionFilter = args.filter?.and?.find((f) => f.permission);
        if (permissionFilter?.permission) {
            await this.userService.warmupHasPermissionCache();
            const permission = permissionFilter.permission;
            // If a permission filter is provided, we need to get all users and filter them
            const filteredUsers: User[] = [];
            let offset = 0;
            let users: User[] = [];
            do {
                [users] = await this.userService.findUsers({ filter: args.filter, sort: args.sort, offset, limit: 100 });
                for (let i = 0; i < users.length; i++) {
                    if (
                        (permission.equal && (await this.userService.hasPermission(users[i], permission.equal))) ||
                        (permission.isAnyOf && (await this.userService.hasPermission(users[i], permission.isAnyOf))) ||
                        (permission.notEqual && !(await this.userService.hasPermission(users[i], permission.notEqual)))
                    ) {
                        filteredUsers.push(users[i]);
                    }
                }
                offset += users.length;
            } while (users.length > 0);
            return new UserPermissionPaginatedUserList(filteredUsers.slice(args.offset, args.offset + args.limit), filteredUsers.length);
        } else {
            const [users, totalCount] = await this.userService.findUsers(args);
            return new UserPermissionPaginatedUserList(users, totalCount);
        }
    }

    @ResolveField(() => Int)
    async permissionsCount(@Parent() user: UserPermissionsUser): Promise<number> {
        return (await this.userService.getPermissions(user)).length;
    }

    @ResolveField(() => Int)
    async contentScopesCount(@Parent() user: UserPermissionsUser): Promise<number> {
        return (await this.userService.getContentScopes(user)).length;
    }

    @ResolveField(() => Boolean)
    async impersonationAllowed(@Parent() user: UserPermissionsUser, @GetCurrentUser() currentUser: CurrentUser): Promise<boolean> {
        return (
            currentUser.id !== user.id &&
            AbstractAccessControlService.isEqualOrMorePermissions(
                currentUser.permissions,
                await this.userService.getPermissionsAndContentScopes(user),
            )
        );
    }
}
