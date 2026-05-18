import { EntityManager } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { EntityInfoObject } from "../entity-info/entity-info.object";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { FullTextSearchResultObject } from "./dto/full-text-search-result";
import { PaginatedFullTextSearch } from "./dto/paginated-full-text-search";
import { EntityInfoFullTextObject } from "./entities/entity-info-full-text.object";

@Resolver(() => FullTextSearchResultObject)
@RequiredPermission("fullTextSearch", { skipScopeCheck: true })
export class FullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedFullTextSearch)
    async fullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: Record<string, unknown>,
    ): Promise<PaginatedFullTextSearch> {
        // Build query on EntityInfoFullText, applying both fulltext and scope filters
        const qb = this.entityManager.createQueryBuilder(EntityInfoFullTextObject).where({ fullText: { $fulltext: search } });

        if (scope) {
            qb.andWhere(`"scope" @> ?::jsonb`, [JSON.stringify(scope)]);
        }

        const [matches, totalCount] = await qb.offset(offset).limit(limit).getResultAndCount();

        if (matches.length === 0) {
            return new PaginatedFullTextSearch([], totalCount);
        }

        // Join with EntityInfo view to fetch name, secondaryInformation, visible for the matched rows
        const infos = await this.entityManager.find(EntityInfoObject, {
            $or: matches.map((match) => ({ id: match.id, entityName: match.entityName })),
        });

        const infoByKey = new Map(infos.map((info) => [`${info.entityName}:${info.id}`, info]));
        const results = matches.map((match) => {
            const info = infoByKey.get(`${match.entityName}:${match.id}`);
            if (!info) {
                throw new Error(
                    `EntityInfo not found for ${match.entityName}:${match.id}. This may indicate a data inconsistency where the full-text search index contains an entry without corresponding entity information.`,
                );
            }
            const result = new FullTextSearchResultObject();
            result.id = info.id;
            result.entityName = info.entityName;
            result.name = info.name;
            result.secondaryInformation = info.secondaryInformation;
            result.scope = match.scope;
            return result;
        });

        return new PaginatedFullTextSearch(results, totalCount);
    }
}
