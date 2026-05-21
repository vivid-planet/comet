import { AnyEntity, EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Optional } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "../entity-info/entity-info.decorator";
import { isEntityInfoSql, requiredPermissionToSql } from "../entity-info/entity-info.utils";
import { resolveFieldToSql } from "../entity-info/resolve-field-to-sql";
import { PageTreeFullTextService } from "../page-tree/fullText/page-tree-full-text.service";

@Injectable()
export class FullTextSearchService {
    constructor(
        private readonly discoverService: DiscoverService,
        private entityManager: EntityManager,
        @Optional() private readonly pageTreeFullTextService?: PageTreeFullTextService,
    ) {}

    async createEntityInfoFullTextView(): Promise<void> {
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();
        const pageTreeFullText = !!this.pageTreeFullTextService;

        for (const targetEntity of targetEntities) {
            const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity) as EntityInfo<AnyEntity>;
            if (!entityInfo) {
                continue;
            }

            if (typeof entityInfo === "string" || isEntityInfoSql(entityInfo)) {
                if (pageTreeFullText && targetEntity.metadata.tableName === "PageTreeNode") {
                    const requiredPermission = typeof entityInfo === "string" ? undefined : entityInfo.requiredPermission;
                    const requiredPermissionSql = requiredPermissionToSql(requiredPermission);

                    indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."id", 'PageTreeNode' AS "entityName", "PageTreeNodeFullText"."fullText",
                        ${requiredPermissionSql} AS "requiredPermission"
                        FROM "PageTreeNodeEntityInfo"
                        INNER JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeEntityInfo"."id"::uuid`);
                }
                continue;
            }

            if (!entityInfo.fullText) {
                continue;
            }

            const { entityName, metadata } = targetEntity;
            const primary = metadata.primaryKeys[0];

            const fullTextSql = resolveFieldToSql(entityInfo.fullText, metadata, metadata.tableName);
            const requiredPermissionSql = requiredPermissionToSql(entityInfo.requiredPermission);

            indexSelects.push(`SELECT
                            "${metadata.tableName}"."${primary}"::text "id",
                            '${entityName}' "entityName",
                            ${fullTextSql} AS "fullText",
                            ${requiredPermissionSql} AS "requiredPermission"
                        FROM "${metadata.tableName}"`);
        }

        if (indexSelects.length === 0) {
            // Empty placeholder so the view always exists with the expected columns
            indexSelects.push(
                `SELECT NULL::text AS "id", NULL::text AS "entityName", NULL::tsvector AS "fullText", ARRAY[]::text[] AS "requiredPermission" WHERE false`,
            );
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating EntityInfoFullText view");
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "EntityInfoFullText"`);
        await this.entityManager.getConnection().execute(`CREATE VIEW "EntityInfoFullText" AS ${viewSql}`);
        console.timeEnd("creating EntityInfoFullText view");
    }

    async dropEntityInfoFullTextView(): Promise<void> {
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "EntityInfoFullText"`);
    }
}
