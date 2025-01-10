import { Args, Int, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { UserPermissionsUser } from "./dto/user";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
class UserPermissionPaginatedUserList extends PaginatedResponseFactory.create(UserPermissionsUser) {}

@Resolver(() => UserPermissionsUser)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => UserPermissionsUser)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<UserPermissionsUser> {
        return this.userService.getUser(id);
    }

    @Query(() => UserPermissionPaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs): Promise<UserPermissionPaginatedUserList> {
        const [users, totalCount] = await this.userService.findUsers(args);
        return new UserPermissionPaginatedUserList(users, totalCount, args);
    }

    @ResolveField(() => Int)
    async permissionsCount(@Parent() user: UserPermissionsUser): Promise<number> {
        return (await this.userService.getPermissions(user)).length;
    }

    @ResolveField(() => Int)
    async contentScopesCount(@Parent() user: UserPermissionsUser): Promise<number> {
        return (await this.userService.getContentScopes(user)).length;
    }
}
