import { ContentScope, DisablePermissionCheck, RequiredPermission } from "@comet/cms-api";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { PaginatedSiteFullTextSearchResult } from "./dto/paginated-site-full-text-search-result";
import { SiteFullTextSearchResult } from "./entities/site-full-text-search-result.entity";

// Entities exposed to the public site search. Unlike fullTextSearch, this query does not filter by the current user's
// permissions, so it must only ever expose entities whose content is meant to be publicly searchable.
const searchableEntityNames = ["PageTreeNode", "News"];

@Resolver(() => SiteFullTextSearchResult)
export class SiteFullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedSiteFullTextSearchResult)
    @RequiredPermission(DisablePermissionCheck)
    async siteFullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: ContentScope,
    ): Promise<PaginatedSiteFullTextSearchResult> {
        const where: FilterQuery<SiteFullTextSearchResult> = {
            fullText: { $fulltext: search },
            entityName: { $in: searchableEntityNames },
            visible: true,
        };

        if (scope) {
            // GraphQL sends the scope object with a null prototype, which breaks MikroORM's internal hasOwnProperty calls.
            // Spreading into a plain object fixes this. See https://github.com/mikro-orm/mikro-orm/issues/2846.
            where.scopes = { $contains: [{ ...scope }] };
        }

        const [nodes, totalCount] = await this.entityManager.findAndCount(SiteFullTextSearchResult, where, {
            offset,
            limit,
            orderBy: { name: "ASC" },
        });

        return new PaginatedSiteFullTextSearchResult(nodes, totalCount);
    }
}
