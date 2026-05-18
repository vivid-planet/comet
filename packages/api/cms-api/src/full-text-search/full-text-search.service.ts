import { AnyEntity, EntityManager } from "@mikro-orm/postgresql";
import { Injectable, Optional } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "../entity-info/entity-info.decorator";
import { resolveFieldToSql } from "../entity-info/resolve-field-to-sql";
import { PageTreeFullTextService } from "../page-tree/fullText/page-tree-full-text.service";
import {
    isScopedEntitySqlResolvable,
    SCOPED_ENTITY_METADATA_KEY,
    ScopedEntityMeta,
    ScopedEntitySqlMapping,
} from "../user-permissions/decorators/scoped-entity.decorator";

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

            if (typeof entityInfo === "string") {
                if (pageTreeFullText && targetEntity.metadata.tableName === "PageTreeNode") {
                    // PageTreeNode: resolve scope from the embedded scope columns
                    const scopeSql = this.buildScopeFromEmbedded(targetEntity.metadata, "scope", "PageTreeNodeEntityInfo");
                    indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."id", 'PageTreeNode' AS "entityName", "PageTreeNodeFullText"."fullText", ${scopeSql} AS "scope"
                        FROM "PageTreeNodeEntityInfo"
                        INNER JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeEntityInfo"."id"::uuid
                        INNER JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeEntityInfo"."id"::uuid`);
                }
                continue;
            }

            if (!entityInfo.fullText) {
                continue;
            }

            const { entityName, metadata } = targetEntity;
            const primary = metadata.primaryKeys[0];

            const fullTextSql = resolveFieldToSql(entityInfo.fullText, metadata, metadata.tableName);

            // Resolve scope SQL for this entity
            const scopeSql = this.resolveScopeSqlForEntity(targetEntity.entity, metadata, metadata.tableName);

            indexSelects.push(`SELECT
                            "${metadata.tableName}"."${primary}"::text "id",
                            '${entityName}' "entityName",
                            ${fullTextSql} AS "fullText",
                            ${scopeSql} AS "scope"
                        FROM "${metadata.tableName}"`);
        }

        if (indexSelects.length === 0) {
            // Empty placeholder so the view always exists with the expected columns
            indexSelects.push(
                `SELECT NULL::text AS "id", NULL::text AS "entityName", NULL::tsvector AS "fullText", NULL::jsonb AS "scope" WHERE false`,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private resolveScopeSqlForEntity(entity: any, metadata: any, tableName: string): string {
        // 1. Check if entity has a direct embedded "scope" property
        const scopeProp = metadata.props.find((p: { name: string; kind: string }) => p.name === "scope" && p.kind === "embedded");
        if (scopeProp) {
            return this.buildScopeFromEmbedded(metadata, "scope", tableName);
        }

        // 2. Check for @ScopedEntity decorator
        const scopedMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, entity) as ScopedEntityMeta | undefined;
        if (!scopedMeta) {
            return "NULL::jsonb";
        }

        if (!isScopedEntitySqlResolvable(scopedMeta)) {
            throw new Error(
                `Entity "${metadata.className}" uses @EntityInfo with fullText but has a non-SQL-resolvable @ScopedEntity. ` +
                    `Use @ScopedEntity("fieldPath") or @ScopedEntity({ key: "path" }) instead of a callback/service.`,
            );
        }

        if (typeof scopedMeta === "string") {
            // String form: path to an embedded scope object
            const embeddedProp = metadata.props.find((p: { name: string; kind: string }) => p.name === scopedMeta && p.kind === "embedded");
            if (embeddedProp) {
                return this.buildScopeFromEmbedded(metadata, scopedMeta, tableName);
            }
            // Fallback: try resolving as a single JSON column
            return `${resolveFieldToSql(scopedMeta, metadata, tableName)}::jsonb`;
        }

        // Object mapping form: { domain: "scope.domain", language: "scope.language" }
        return this.buildScopeFromMapping(scopedMeta, metadata, tableName);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private buildScopeFromEmbedded(metadata: any, embeddedName: string, tableName: string): string {
        const embeddedProp = metadata.props.find((p: { name: string; kind: string }) => p.name === embeddedName && p.kind === "embedded");
        if (!embeddedProp || !embeddedProp.embeddedProps) {
            return "NULL::jsonb";
        }

        const parts: string[] = [];
        for (const [key, childProp] of Object.entries(embeddedProp.embeddedProps)) {
            const fieldName = (childProp as { fieldNames: string[] }).fieldNames[0];
            parts.push(`'${key}', "${tableName}"."${fieldName}"`);
        }
        return `jsonb_build_object(${parts.join(", ")})`;
    }

    private buildScopeFromMapping(
        mapping: ScopedEntitySqlMapping,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: any,
        tableName: string,
    ): string {
        const parts: string[] = [];
        for (const [scopeKey, fieldPath] of Object.entries(mapping)) {
            const fieldSql = resolveFieldToSql(fieldPath, metadata, tableName);
            parts.push(`'${scopeKey}', ${fieldSql}`);
        }
        return `jsonb_build_object(${parts.join(", ")})`;
    }
}
