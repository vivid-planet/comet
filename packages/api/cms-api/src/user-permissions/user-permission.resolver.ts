import { Args, ArgsType, Field, ID, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { IsString } from "class-validator";

import { PermissionCheck } from "./auth/permission-check";
import { CreateUserPermissionInput, UpdateUserPermissionInput, UserPermissionContentScopesInput } from "./dto/user-permission.input";
import { UserPermission } from "./entities/user-permission.entity";
import { UserPermissionsService } from "./user-permissions.service";
import { USERPERMISSIONS } from "./user-permissions.types";

@ArgsType()
export class UserPermissionListArgs {
    @Field()
    @IsString()
    userId: string;
}

@ObjectType()
class AvailablePermission {
    @Field()
    permission: string;
    @Field()
    name: string;
    @Field({ nullable: true })
    description?: string;
}

@Resolver(() => UserPermission)
@PermissionCheck({
    allowedForPermissions: [USERPERMISSIONS.userPermissions],
    skipScopeCheck: true,
})
export class UserPermissionResolver {
    constructor(private readonly userService: UserPermissionsService) {}

    @Query(() => [UserPermission])
    async userPermissionsPermissionList(@Args() args: UserPermissionListArgs): Promise<UserPermission[]> {
        return this.userService.getPermissions(args.userId);
    }

    @Query(() => UserPermission)
    async userPermissionsPermission(
        @Args("id", { type: () => ID }) id: string,
        @Args("userId", { type: () => String, nullable: true }) userId?: string,
    ): Promise<UserPermission> {
        return this.userService.getPermission(id, userId);
    }

    @Mutation(() => UserPermission)
    async userPermissionsCreatePermission(
        @Args("data", { type: () => CreateUserPermissionInput }) data: CreateUserPermissionInput,
    ): Promise<UserPermission> {
        const permission = new UserPermission();
        permission.assign(data);
        return this.userService.upsertPermission(permission);
    }

    @Query(() => [AvailablePermission])
    async userPermissionsAvailablePermissions(): Promise<AvailablePermission[]> {
        const permissions = await this.userService.getAvailablePermissions();
        const ret: AvailablePermission[] = [];
        for (const k in permissions) {
            ret.push({ permission: k, name: permissions[k].name, description: permissions[k].description });
        }
        return ret;
    }

    @Mutation(() => UserPermission)
    async userPermissionsUpdatePermission(
        @Args("data", { type: () => UpdateUserPermissionInput }) data: UpdateUserPermissionInput,
    ): Promise<UserPermission> {
        const permission = await this.userService.getPermission(data.id);
        permission.assign(data);
        await this.userService.upsertPermission(permission);
        return permission;
    }

    @Mutation(() => UserPermission)
    async userPermissionsSetPermissionContentScopes(
        @Args("data", { type: () => UserPermissionContentScopesInput }) data: UserPermissionContentScopesInput,
    ): Promise<UserPermission> {
        const permission = await this.userService.getPermission(data.permissionId);
        permission.assign(data);
        await this.userService.upsertPermission(permission);
        return permission;
    }

    @Mutation(() => Boolean)
    async userPermissionsDeletePermission(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        this.userService.deletePermission(id);
        return true;
    }

    @ResolveField("name", () => String)
    async resolvePermissionName(@Parent() permission: UserPermission): Promise<string> {
        return (await this.userService.getAvailablePermissions())[permission.permission].name;
    }

    @ResolveField("description", () => String, { nullable: true })
    async resolvePermissionDescription(@Parent() permission: UserPermission): Promise<string | undefined> {
        return (await this.userService.getAvailablePermissions())[permission.permission].description;
    }
}
