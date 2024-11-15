import { Args, Int, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { CometUser } from "./dto/user";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
class UserPermissionPaginatedUserList extends PaginatedResponseFactory.create(CometUser) {}

@Resolver(() => CometUser)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => CometUser)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<CometUser> {
        return this.userService.getUser(id);
    }

    @Query(() => UserPermissionPaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs): Promise<UserPermissionPaginatedUserList> {
        const [users, totalCount] = await this.userService.findUsers(args);
        return new UserPermissionPaginatedUserList(users, totalCount, args);
    }

    @ResolveField(() => Int)
    async permissionsCount(@Parent() user: CometUser): Promise<number> {
        return (await this.userService.getPermissions(user)).length;
    }

    @ResolveField(() => Int)
    async contentScopesCount(@Parent() user: CometUser): Promise<number> {
        return (await this.userService.getContentScopes(user)).length;
    }
}
