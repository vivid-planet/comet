import { EntityManager } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

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
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: Record<string, unknown>,
    ): Promise<PaginatedEntityInfo> {
        const [matches, totalCount] = await this.entityManager.findAndCount(
            EntityInfoFullTextObject,
            { fullText: { $fulltext: search } },
            { offset, limit },
        );

        if (matches.length === 0) {
            return new PaginatedEntityInfo([], totalCount);
        }

        // Join with EntityInfo view to fetch name, secondaryInformation, visible, scope for the matched rows
        // If scope filter is provided, apply it using jsonb containment
        const qb = this.entityManager
            .createQueryBuilder(EntityInfoObject)
            .where({ $or: matches.map((match) => ({ id: match.id, entityName: match.entityName })) });

        if (scope) {
            qb.andWhere(`"scope" @> ?::jsonb`, [JSON.stringify(scope)]);
        }

        const infos = await qb.getResult();

        const infoByKey = new Map(infos.map((info) => [`${info.entityName}:${info.id}`, info]));

        // When scope filtering, only include matches that have a corresponding EntityInfo (some may be filtered out)
        const results: EntityInfoObject[] = [];
        for (const match of matches) {
            const info = infoByKey.get(`${match.entityName}:${match.id}`);
            if (scope) {
                // With scope filter, skip matches that don't pass the scope filter
                if (info) {
                    results.push(info);
                }
            } else {
                if (!info) {
                    throw new Error(
                        `EntityInfo not found for ${match.entityName}:${match.id}. This may indicate a data inconsistency where the full-text search index contains an entry without corresponding entity information.`,
                    );
                }
                results.push(info);
            }
        }

        return new PaginatedEntityInfo(results, scope ? results.length : totalCount);
    }
}
