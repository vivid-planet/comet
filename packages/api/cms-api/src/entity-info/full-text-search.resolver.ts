import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { GetCurrentUser } from "../auth/decorators/get-current-user.decorator";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { CurrentUser } from "../user-permissions/dto/current-user";
import { PaginatedEntityInfo } from "./dto/paginated-entity-info";
import { EntityInfoObject } from "./entity-info.object";

@Resolver(() => EntityInfoObject)
@RequiredPermission("fullTextSearch", { skipScopeCheck: true })
export class FullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedEntityInfo)
    async fullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @GetCurrentUser() user: CurrentUser,
    ): Promise<PaginatedEntityInfo> {
        const where: FilterQuery<EntityInfoObject> = {
            fullText: { $fulltext: search },
        };

        // Filter results by user's permissions (skip for system users which are represented as strings)
        if (typeof user !== "string" && user.permissions) {
            const userPermissions = user.permissions.map((p) => p.permission);
            if (userPermissions.length > 0) {
                where.$or = [{ requiredPermission: null }, { requiredPermission: { $overlap: userPermissions } }];
            } else {
                where.requiredPermission = null;
            }
        }

        const [results, totalCount] = await this.entityManager.findAndCount(EntityInfoObject, where, {
            offset,
            limit,
        });

        return new PaginatedEntityInfo(results, totalCount);
    }
}
