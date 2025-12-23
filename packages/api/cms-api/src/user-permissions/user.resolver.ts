import { Args, Int, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { AbstractAccessControlService } from "./access-control.service";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs, PermissionFilter } from "./dto/paginated-user-list";
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
        const permissionAndFilters = args.filter?.and?.filter((f) => f.permission).map((f) => f.permission) as PermissionFilter[];
        const permissionOrFilters = args.filter?.or?.filter((f) => f.permission).map((f) => f.permission) as PermissionFilter[];
        if (permissionAndFilters && permissionOrFilters) {
            throw new Error("You cannot use both 'and' and 'or' permission filters at the same time.");
        }
        if (permissionAndFilters && permissionAndFilters.length > 0) {
            await this.userService.warmupHasPermissionCache();
            // If a permission filter is provided, we need to get all users and filter them
            const filteredUsers: User[] = [];
            let offset = 0;
            let users: User[] = [];
            do {
                [users] = await this.userService.findUsers({ filter: args.filter, sort: args.sort, offset, limit: 100 });
                for (let i = 0; i < users.length; i++) {
                    if (await this.permissionAndFiltersApplies(users[i], permissionAndFilters)) {
                        filteredUsers.push(users[i]);
                    }
                }
                offset += users.length;
            } while (users.length > 0);
            return new UserPermissionPaginatedUserList(filteredUsers.slice(args.offset, args.offset + args.limit), filteredUsers.length);
        } else if (permissionOrFilters && permissionOrFilters.length > 0) {
            await this.userService.warmupHasPermissionCache();
            const matchedUsers = new Set<User>();
            let users: User[] = [];
            // Add all users that match other than permission filters
            if (args.filter?.or?.some((f) => !f.permission)) {
                let offset = 0;
                do {
                    [users] = await this.userService.findUsers({ filter: args.filter, sort: args.sort, offset, limit: 100 });
                    for (let i = 0; i < users.length; i++) {
                        matchedUsers.add(users[i]);
                    }
                    offset += users.length;
                } while (users.length > 0);
            }
            // Add users that match permission filters
            let offset = 0;
            do {
                [users] = await this.userService.findUsers({ sort: args.sort, offset, limit: 100 });
                for (let i = 0; i < users.length; i++) {
                    if (await this.permissionOrFiltersApplies(users[i], permissionOrFilters)) {
                        matchedUsers.add(users[i]);
                    }
                }
                offset += users.length;
            } while (users.length > 0);
            return new UserPermissionPaginatedUserList(Array.from(matchedUsers).slice(args.offset, args.offset + args.limit), matchedUsers.size);
        } else {
            const [users, totalCount] = await this.userService.findUsers(args);
            return new UserPermissionPaginatedUserList(users, totalCount);
        }
    }

    async permissionAndFiltersApplies(user: User, filters: PermissionFilter[]): Promise<boolean> {
        for (const filter of filters) {
            if (
                (filter.equal && !(await this.userService.hasPermission(user, filter.equal))) ||
                (filter.isAnyOf && !(await this.userService.hasPermission(user, filter.isAnyOf))) ||
                (filter.notEqual && (await this.userService.hasPermission(user, filter.notEqual)))
            ) {
                return false;
            }
        }
        return true;
    }

    async permissionOrFiltersApplies(user: User, filters: PermissionFilter[]): Promise<boolean> {
        for (const filter of filters) {
            if (
                (filter.equal && (await this.userService.hasPermission(user, filter.equal))) ||
                (filter.isAnyOf && (await this.userService.hasPermission(user, filter.isAnyOf))) ||
                (filter.notEqual && !(await this.userService.hasPermission(user, filter.notEqual)))
            ) {
                return true;
            }
        }
        return false;
    }

    @ResolveField(() => Int)
    async permissionsCount(@Parent() user: UserPermissionsUser): Promise<number> {
        return [...new Set((await this.userService.getPermissions(user)).map((p) => p.permission))].length;
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
