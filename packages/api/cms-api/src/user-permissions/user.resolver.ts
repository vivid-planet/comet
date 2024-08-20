import { Inject, Optional } from "@nestjs/common";
import { Args, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { CurrentUser } from "./dto/current-user";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { USER_PERMISSIONS_USER_SERVICE } from "./user-permissions.constants";
import { UserPermissionsUserServiceInterface } from "./user-permissions.types";

@ObjectType()
class PaginatedUserList extends PaginatedResponseFactory.create(User) {}

@Resolver(() => User)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(@Inject(USER_PERMISSIONS_USER_SERVICE) @Optional() private readonly userService: UserPermissionsUserServiceInterface | undefined) {}

    private getUserService(): UserPermissionsUserServiceInterface {
        if (!this.userService) throw new Error("For this functionality you need to define the userService in the UserPermissionsModule.");
        return this.userService;
    }

    @Query(() => User)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string, @GetCurrentUser() currentUser: CurrentUser): Promise<User> {
        return this.getUserService().getUser(id, currentUser);
    }

    @Query(() => PaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs, @GetCurrentUser() currentUser: CurrentUser): Promise<PaginatedUserList> {
        const [users, totalCount] = await this.getUserService().findUsers(args, currentUser);
        return new PaginatedUserList(users, totalCount, args);
    }
}
