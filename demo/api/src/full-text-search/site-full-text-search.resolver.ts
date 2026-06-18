import {
    ContentScope,
    DisablePermissionCheck,
    EntityInfoFullTextObject,
    EntityInfoObject,
    PaginatedEntityInfo,
    RequiredPermission,
} from "@comet/cms-api";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

// Entities exposed to the public site search. Unlike fullTextSearch, this query does not filter by the current user's
// permissions, so it must only ever expose entities whose content is meant to be publicly searchable.
const searchableEntityNames = ["PageTreeNode", "News"];

@Resolver(() => EntityInfoObject)
export class SiteFullTextSearchResolver {
    constructor(private readonly entityManager: EntityManager) {}

    @Query(() => PaginatedEntityInfo)
    @RequiredPermission(DisablePermissionCheck)
    async siteFullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: ContentScope,
    ): Promise<PaginatedEntityInfo> {
        const where: FilterQuery<EntityInfoFullTextObject> = {
            fullText: { $fulltext: search },
            entityName: { $in: searchableEntityNames },
            entityInfo: { visible: true },
        };

        if (scope) {
            // The view exposes a `scopes` array, so match rows whose scopes contain the requested scope.
            // GraphQL sends the scope object with a null prototype, which breaks MikroORM's internal hasOwnProperty calls.
            // Spreading into a plain object fixes this. See https://github.com/mikro-orm/mikro-orm/issues/2846.
            where.scopes = { $contains: [{ ...scope }] };
        }

        const [matches, totalCount] = await this.entityManager.findAndCount(EntityInfoFullTextObject, where, {
            offset,
            limit,
            populate: ["entityInfo"],
        });

        return new PaginatedEntityInfo(
            matches.map((match) => match.entityInfo),
            totalCount,
        );
    }
}
