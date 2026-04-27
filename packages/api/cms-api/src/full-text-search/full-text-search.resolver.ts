import { EntityManager } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { EntityInfoObject } from "../entity-info/entity-info.object";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { PaginatedEntityInfo } from "./dto/paginated-entity-info";
import { EntityInfoFullTextObject } from "./entities/entity-info-full-text.object";

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
        const [matches, totalCount] = await this.entityManager.findAndCount(
            EntityInfoFullTextObject,
            { fullText: { $fulltext: search } },
            { offset, limit },
        );

        if (matches.length === 0) {
            return new PaginatedEntityInfo([], totalCount);
        }

        // Join with EntityInfo view to fetch name, secondaryInformation, visible for the matched rows
        const infos = await this.entityManager.find(EntityInfoObject, {
            $or: matches.map((match) => ({ id: match.id, entityName: match.entityName })),
        });

        const infoByKey = new Map(infos.map((info) => [`${info.entityName}:${info.id}`, info]));
        const results = matches
            .map((match) => infoByKey.get(`${match.entityName}:${match.id}`))
            .filter((info): info is EntityInfoObject => info !== undefined);

        return new PaginatedEntityInfo(results, totalCount);
    }
}
