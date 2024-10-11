import { Args, Context, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { Request } from "express";

import { PaginatedResponseFactory } from "../common/pagination/paginated-response.factory";
import { DisablePermissionCheck, RequiredPermission } from "./decorators/required-permission.decorator";
import { FindUsersResolverArgs } from "./dto/paginated-user-list";
import { User } from "./dto/user";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
class PaginatedUserList extends PaginatedResponseFactory.create(User) {}

@Resolver(() => User)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => User)
    async userPermissionsUserById(@Args("id", { type: () => String }) id: string): Promise<User> {
        return this.userService.getUser(id);
    }

    @Query(() => PaginatedUserList)
    async userPermissionsUsers(@Args() args: FindUsersResolverArgs): Promise<PaginatedUserList> {
        const [users, totalCount] = await this.userService.findUsers(args);
        return new PaginatedUserList(users, totalCount, args);
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
