import { Type } from "@nestjs/common";
import { Args, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { PermissionCheck } from "./auth/permission-check";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserManagementService } from "./user-management.service";
import { USERMANAGEMENT } from "./user-management.types";

@ObjectType()
class PaginatedUserList extends PaginatedResponseFactory.create(User) {}

export function createUserResolver(): Type {
    @Resolver(() => User)
    @PermissionCheck({
        allowedForPermissions: [USERMANAGEMENT.userManagement],
        skipScopeCheck: true,
    })
    class UserManagementResolver {
        constructor(private readonly userService: UserManagementService) {}

        @Query(() => User)
        async userManagementUserById(@Args("id", { type: () => String }) id: string): Promise<User> {
            return this.userService.getUser(id);
        }

        @Query(() => PaginatedUserList)
        async userManagementUsers(@Args() args: FindUsersArgs): Promise<PaginatedUserList> {
            const [users, totalCount] = await this.userService.findUsers(args);
            return new PaginatedUserList(users, totalCount, args);
        }
    }
    return UserManagementResolver;
}
