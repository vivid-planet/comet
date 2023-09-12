import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Args, ArgsType, Field, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { IsString } from "class-validator";

import { CreateUserPermissionInput, UpdateUserPermissionInput } from "./dto/user-permission.input";
import { UserPermission } from "./entities/user-permission.entity";
import { UserPermissionsService } from "./user-permissions.service";

@ArgsType()
export class UserPermissionListArgs {
    @Field()
    @IsString()
    userId: string;
}

@Resolver(() => UserPermission)
export class UserPermissionResolver {
    constructor(
        private readonly userService: UserPermissionsService,
        @InjectRepository(UserPermission) private readonly permissionRepository: EntityRepository<UserPermission>,
    ) {}

    @Query(() => [UserPermission])
    async userPermissionsPermissionList(@Args() args: UserPermissionListArgs): Promise<UserPermission[]> {
        return this.userService.getPermissions(args.userId);
    }

    @Query(() => UserPermission)
    async userPermissionsPermission(
        @Args("id", { type: () => ID }) id: string,
        @Args("userId", { type: () => String, nullable: true }) userId?: string,
    ): Promise<UserPermission> {
        return this.getPermission(id, userId);
    }

    @Mutation(() => UserPermission)
    async userPermissionsCreatePermission(
        @Args("input", { type: () => CreateUserPermissionInput }) data: CreateUserPermissionInput,
    ): Promise<UserPermission> {
        const permission = new UserPermission();
        permission.assign(data);
        await this.permissionRepository.persistAndFlush(permission);
        return permission;
    }

    @Query(() => [String])
    async userPermissionsAvailablePermissions(): Promise<string[]> {
        return this.userService.getAvailablePermissions();
    }

    @Mutation(() => UserPermission)
    async userPermissionsUpdatePermission(
        @Args("input", { type: () => UpdateUserPermissionInput }) data: UpdateUserPermissionInput,
    ): Promise<UserPermission> {
        const permission = await this.getPermission(data.id);
        permission.assign(data);
        await this.permissionRepository.persistAndFlush(permission);
        return permission;
    }

    @Mutation(() => Boolean)
    async userPermissionsDeletePermission(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        this.permissionRepository.removeAndFlush(await this.getPermission(id));
        return true;
    }

    async getPermission(id: string, userId?: string): Promise<UserPermission> {
        const permission = await this.permissionRepository.findOne(id);
        if (permission) return permission;
        if (!userId) {
            throw new Error(`Permission not found: ${id}`);
        }
        for (const p of await this.userService.getPermissions(userId)) {
            if (p.id === id) return p;
        }
        throw new Error("Permission not found");
    }
}
