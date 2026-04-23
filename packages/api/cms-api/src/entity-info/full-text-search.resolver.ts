import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Inject, Optional, Type } from "@nestjs/common";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-scalars";

import { DocumentInterface } from "../document/dto/document-interface";
import { PAGE_TREE_DOCUMENTS } from "../page-tree/page-tree.constants";
import { RequiredPermission } from "../user-permissions/decorators/required-permission.decorator";
import { PaginatedEntityInfo } from "./dto/paginated-entity-info";
import { EntityInfoObject } from "./entity-info.object";

@Resolver(() => EntityInfoObject)
@RequiredPermission("fullTextSearch", { skipScopeCheck: true })
export class FullTextSearchResolver {
    constructor(
        private readonly entityManager: EntityManager,
        @Optional() @Inject(PAGE_TREE_DOCUMENTS) private readonly pageTreeDocuments?: Type<DocumentInterface>[],
    ) {}

    @Query(() => PaginatedEntityInfo)
    async fullTextSearch(
        @Args("search") search: string,
        @Args("offset", { type: () => Int, defaultValue: 0 }) offset: number,
        @Args("limit", { type: () => Int, defaultValue: 25 }) limit: number,
        @Args("scope", { type: () => GraphQLJSONObject, nullable: true }) scope?: Record<string, unknown>,
    ): Promise<PaginatedEntityInfo> {
        // Page-tree documents (Page, Link, ...) are present in the EntityInfo view so that
        // dependency lookups via getEntityInfo() can resolve document-id references. They share
        // their tsvector with the PageTreeNode row, which would make every match surface twice.
        // Exclude them here so fulltext search returns only the canonical PageTreeNode row.
        const where: FilterQuery<EntityInfoObject> = {
            fullText: { $fulltext: search },
        };
        if (this.pageTreeDocuments?.length) {
            where.entityName = { $nin: this.pageTreeDocuments.map((Document) => Document.name) };
        }

        const qb = this.entityManager.createQueryBuilder(EntityInfoObject).where(where);

        // Filter by scope if provided using jsonb containment operator
        if (scope) {
            qb.andWhere(`"scope" @> ?::jsonb`, [JSON.stringify(scope)]);
        }

        const [results, totalCount] = await qb.offset(offset).limit(limit).getResultAndCount();

        return new PaginatedEntityInfo(results, totalCount);
    }
}
