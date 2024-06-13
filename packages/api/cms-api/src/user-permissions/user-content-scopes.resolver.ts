import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { SkipBuild } from "../builds/skip-build.decorator";
import { RequiredPermission } from "./decorators/required-permission.decorator";
import { AvailableContentScope } from "./dto/available-content-scope";
import { UserContentScopesInput } from "./dto/user-content-scopes.input";
import { UserContentScopes } from "./entities/user-content-scopes.entity";
import { ContentScope } from "./interfaces/content-scope.interface";
import { UserPermissionsService } from "./user-permissions.service";

@Resolver()
@RequiredPermission(["userPermissions"], { skipScopeCheck: true })
export class UserContentScopesResolver {
    constructor(
        @InjectRepository(UserContentScopes) private readonly repository: EntityRepository<UserContentScopes>,
        private readonly service: UserPermissionsService,
    ) {}

    @Mutation(() => Boolean)
    @SkipBuild()
    async userPermissionsUpdateContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("input", { type: () => UserContentScopesInput }) { contentScopes }: UserContentScopesInput,
    ): Promise<boolean> {
        await this.service.checkContentScopes(contentScopes);
        let entity = await this.repository.findOne({ userId });
        if (entity) {
            entity = this.repository.assign(entity, { userId, contentScopes });
        } else {
            entity = this.repository.create({ userId, contentScopes });
        }
        await this.repository.persistAndFlush(entity);
        return true;
    }

    @Query(() => [GraphQLJSONObject])
    async userPermissionsContentScopes(
        @Args("userId", { type: () => String }) userId: string,
        @Args("skipManual", { type: () => Boolean, nullable: true }) skipManual = false,
    ): Promise<ContentScope[]> {
        return this.service.normalizeContentScopes(
            await this.service.getContentScopes(await this.service.getUser(userId), !skipManual),
            await this.service.getAvailableContentScopes(),
        );
    }

    @Query(() => [AvailableContentScope])
    async userPermissionsAvailableContentScopes(): Promise<AvailableContentScope[]> {
        const scopes = await this.service.getAvailableContentScopes();
        return scopes.map((contentScope) => ({ contentScope, label: this.service.getLabelForContentScope(contentScope) }));
    }
}
