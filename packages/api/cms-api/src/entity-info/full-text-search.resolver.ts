import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
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
    ): Promise<PaginatedEntityInfo> {
        const where: FilterQuery<EntityInfoObject> = {
            fullText: { $fulltext: search },
        };

        const [results, totalCount] = await this.entityManager.findAndCount(EntityInfoObject, where, {
            offset,
            limit,
        });

        return new PaginatedEntityInfo(results, totalCount);
    }
}
