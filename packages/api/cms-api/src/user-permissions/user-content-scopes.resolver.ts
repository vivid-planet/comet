import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { SkipBuild } from "../builds/skip-build.decorator";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { UserContentScopesInput } from "./dto/user-content-scopes.input";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { UserPermissionsService } from "./user-permissions.service";

@Resolver()
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserContentScopesResolver {
    constructor(
        @InjectRepository(UserContentScopes) private readonly repository: EntityRepository<UserContentScopes>,
        private readonly userService: UserPermissionsService,
        private readonly entityManager: EntityManager,
    ) {}

    @Mutation(() => Boolean)
    @SkipBuild()
    async userPermissionsUpdateContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("input", { type: () => UserContentScopesInput }) { contentScopes }: UserContentScopesInput,
    ): Promise<boolean> {
        await this.userService.checkContentScopes(contentScopes);
        let entity = await this.repository.findOne({ userId });
        if (entity) {
            entity = this.repository.assign(entity, { userId, contentScopes });
        } else {
            entity = this.repository.create({ userId, contentScopes });
        }
        await this.entityManager.persistAndFlush(entity);
        return true;
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
    ): Promise<ContentScope[]> {
        return this.userService.normalizeContentScopes(
            await this.userService.getContentScopes(await this.userService.getUser(userId), !skipManual),
            await this.userService.getAvailableContentScopes(),
        );
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsAvailableContentScopes(): Promise<ContentScope[]> {
        return this.userService.getAvailableContentScopes();
    }
}
