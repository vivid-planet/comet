import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { FindUsersArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
class PaginatedUserList extends PaginatedResponseFactory.create(User) {}

@ObjectType()
class UserPermissionsOptions {
    @Field()
    showAllUsersButton: boolean;
}

@Resolver(() => User)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => User)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<User> {
        return this.userService.getUser(id);
    }

    @Query(() => PaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersArgs): Promise<PaginatedUserList> {
        const [users, totalCount] = await this.userService.findUsers(args);
        return new PaginatedUserList(users, totalCount, args);
    }

    @Query(() => UserPermissionsOptions)
    userPermissionsOptions(): UserPermissionsOptions {
        const options = this.userService.getOptions();
        return {
            showAllUsersButton: !!options.filterUsersWithoutPermission,
        };
    }
}
