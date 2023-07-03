import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Type } from "@nestjs/common";
import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { PermissionCheck } from "./auth/permission-check";
import { UserContentScopesInput } from "./dto/user-content-scopes.input";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserManagementService } from "./user-management.service";
import { USERMANAGEMENT } from "./user-management.types";

@ObjectType()
class AvailableContentScopes {
    @Field()
    scope: string;

    @Field()
    label: string;

    @Field(() => [AvailableContentScopeValues])
    values: AvailableContentScopeValues[] = [];
}

@ObjectType()
export class AvailableContentScopeValues {
    @Field()
    label: string;

    @Field()
    value: string;
}

export function createUserContentScopesResolver(): Type {
    @Resolver(() => UserContentScopes)
    @PermissionCheck({
        allowedForPermissions: [USERMANAGEMENT.userManagement],
        skipScopeCheck: true,
    })
    class UserContentScopesResolver {
        constructor(
            @InjectRepository(UserContentScopes) private readonly repository: EntityRepository<UserContentScopes>,
            private readonly userService: UserManagementService,
        ) {}

        @Mutation(() => UserContentScopes)
        async userManagementSetContentScope(
            @Args("input", { type: () => UserContentScopesInput }) data: UserContentScopesInput,
        ): Promise<UserContentScopes> {
            const allowedScopes = await this.userService.getAvailableContentScopes();
            const userId = data.userId;

            for (const scope of data.scopes) {
                if (!Object.keys(allowedScopes).includes(scope.scope)) {
                    throw new Error(`Scope ${scope.scope} does not exist. Existing Scopes: ${Object.keys(allowedScopes).join(", ")}`);
                }
                for (const value of scope.values) {
                    if (!allowedScopes[scope.scope].values.some((v) => v.value === value)) {
                        throw new Error(`Value ${value} for scope ${scope.scope} is not allowed.`);
                    }
                }
            }
            let entity = await this.repository.findOne({ userId });
            if (entity) {
                entity = this.repository.assign(entity, data);
            } else {
                entity = this.repository.create(data);
            }
            await this.repository.persistAndFlush(entity);
            return { userId, scopes: await this.userService.getContentScopes(userId) };
        }

        @Query(() => UserContentScopes)
        async userManagementContentScope(
            @Args("userId", { type: () => String }) userId: string,
            @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
        ): Promise<UserContentScopes> {
            return { userId, scopes: await this.userService.getContentScopes(userId, skipManual) };
        }

        @Query(() => [AvailableContentScopes])
        async userManagementAvailableContentScopes(): Promise<AvailableContentScopes[]> {
            const contentScopes = await this.userService.getAvailableContentScopes();
            return Object.keys(contentScopes).map((scope) => ({
                scope,
                ...contentScopes[scope],
            }));
        }
    }
    return UserContentScopesResolver;
}
