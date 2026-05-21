import { AnyEntity, EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Optional } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo, EntityInfoSql } from "../entity-info/entity-info.decorator";
import { resolveFieldToSql } from "../entity-info/resolve-field-to-sql";
import { PageTreeFullTextService } from "../page-tree/fullText/page-tree-full-text.service";
import { REQUIRED_PERMISSION_METADATA_KEY, RequiredPermissionMetadata } from "../user-permissions/decorators/required-permission.decorator";

function isEntityInfoSql(entityInfo: EntityInfo<AnyEntity>): entityInfo is EntityInfoSql {
    return typeof entityInfo === "object" && "sql" in entityInfo;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRequiredPermissionFromEntity(entity: any): string[] {
    const metadata = Reflect.getMetadata(REQUIRED_PERMISSION_METADATA_KEY, entity) as RequiredPermissionMetadata | undefined;
    if (!metadata) {
        return [];
    }
    return metadata.requiredPermission.filter((p) => p !== "disablePermissionCheck") as string[];
}

function requiredPermissionToSql(requiredPermission: string[]): string {
    if (requiredPermission.length === 0) {
        return "ARRAY[]::text[]";
    }
    return `ARRAY[${requiredPermission.map((p) => `'${p}'`).join(", ")}]::text[]`;
}

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
                    const requiredPermission = getRequiredPermissionFromEntity(targetEntity.entity);
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
            const requiredPermissionSql = requiredPermissionToSql(getRequiredPermissionFromEntity(targetEntity.entity));

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
