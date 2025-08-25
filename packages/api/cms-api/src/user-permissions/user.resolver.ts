import { Args, Int, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { AbstractAccessControlService } from "./access-control.service";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { ContentScopeFilter } from "./dto/content-scope-filter.input";
import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs, PermissionFilter } from "./dto/paginated-user-list";
import { UserPermissionsUser } from "./dto/user";
import { User } from "./interfaces/user";
import { UserPermissionsService } from "./user-permissions.service";

type Filter<T> = {
    isAnyOf?: Array<T>;
    equal?: T;
    notEqual?: T;
};

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
        const scopeAndFilters = args.filter?.and?.filter((f) => f.scope).map((f) => f.scope) as ContentScopeFilter[];
        const permissionOrFilters = args.filter?.or?.filter((f) => f.permission).map((f) => f.permission) as PermissionFilter[];
        const scopeOrFilters = args.filter?.or?.filter((f) => f.scope).map((f) => f.scope) as ContentScopeFilter[];
        if ((permissionAndFilters || scopeAndFilters) && (permissionOrFilters || scopeOrFilters)) {
            throw new Error("You cannot use both 'and' and 'or' permission filters at the same time.");
        }
        if ((permissionAndFilters && permissionAndFilters.length > 0) || (scopeAndFilters && scopeAndFilters.length > 0)) {
            await this.userService.warmupCache();
            // If a permission filter is provided, we need to get all users and filter them
            const filteredUsers: User[] = [];
            let offset = 0;
            let users: User[] = [];
            do {
                [users] = await this.userService.findUsers({ filter: args.filter, sort: args.sort, offset, limit: 100 });
                for (let i = 0; i < users.length; i++) {
                    if (
                        (await this.andFiltersApply(permissionAndFilters, (filter) => this.userService.hasPermission(users[i], filter))) &&
                        (await this.andFiltersApply(scopeAndFilters, (filter) => this.userService.hasContentScope(users[i], filter)))
                    ) {
                        filteredUsers.push(users[i]);
                    }
                }
                offset += users.length;
            } while (users.length > 0);
            return new UserPermissionPaginatedUserList(filteredUsers.slice(args.offset, args.offset + args.limit), filteredUsers.length);
        } else if (permissionOrFilters && permissionOrFilters.length > 0) {
            await this.userService.warmupCache();
            const matchedUsers = new Set<User>();
            let users: User[] = [];
            // Add all users that match other than permission and scope filters
            if (args.filter?.or?.some((f) => !f.permission && !f.scope)) {
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
                    if (
                        (await this.orFiltersApply(permissionOrFilters, (filter) => this.userService.hasPermission(users[i], filter))) ||
                        (await this.orFiltersApply(scopeOrFilters, (filter) => this.userService.hasContentScope(users[i], filter)))
                    ) {
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

    async andFiltersApply<T>(filters: Filter<T>[], callback: (filter: Array<T>) => Promise<boolean>): Promise<boolean> {
        for (const filter of filters) {
            if (
                (filter.equal && !(await callback([filter.equal]))) ||
                (filter.isAnyOf && !(await callback(filter.isAnyOf))) ||
                (filter.notEqual && (await callback([filter.notEqual])))
            ) {
                return false;
            }
        }
        return true;
    }

    async orFiltersApply<T>(filters: Filter<T>[], callback: (filter: Array<T>) => Promise<boolean>): Promise<boolean> {
        for (const filter of filters) {
            if (
                (filter.equal && (await callback([filter.equal]))) ||
                (filter.isAnyOf && (await callback(filter.isAnyOf))) ||
                (filter.notEqual && !(await callback([filter.notEqual])))
            ) {
                return true;
            }
        }
        return false;
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
