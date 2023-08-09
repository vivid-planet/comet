import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "./decorators/required-permission.decorator";
import { UserContentScopesInput } from "./dto/user-content-scopes.input";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { UserPermissionsService } from "./user-permissions.service";

@ObjectType()
export class AvailableContentScopes {
    @Field()
    scope: string;

    @Field(() => [String])
    values: string[];
}

@Resolver(() => UserContentScopes)
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserContentScopesResolver {
    constructor(
        @InjectRepository(UserContentScopes) private readonly repository: EntityRepository<UserContentScopes>,
        private readonly userService: UserPermissionsService,
    ) {}

    @Mutation(() => UserContentScopes)
    async userPermissionsSetContentScope(
        @Args("input", { type: () => UserContentScopesInput }) data: UserContentScopesInput,
    ): Promise<UserContentScopes> {
        this.userService.checkContentScopes(data.scopes);
        const userId = data.userId;
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
    async userPermissionsContentScope(
        @Args("userId", { type: () => String }) userId: string,
        @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
    ): Promise<UserContentScopes> {
        return { userId, scopes: await this.userService.getContentScopes(userId, skipManual) };
    }

    @Query(() => [AvailableContentScopes])
    async userPermissionsAvailableContentScopes(): Promise<AvailableContentScopes[]> {
        return this.userService.getAvailableContentScopes();
    }
}
