import { AnyEntity, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import {
    isScopedEntityCallbackOrService,
    isScopedEntityRelationPath,
    isScopedEntitySqlMapping,
    SCOPED_ENTITY_METADATA_KEY,
    ScopedEntityMeta,
} from "../user-permissions/decorators/scoped-entity.decorator";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "./entity-info.decorator";
import { EntityInfoObject } from "./entity-info.object";

@Injectable()
export class EntityInfoService {
    private readonly logger = new Logger(EntityInfoService.name);

    constructor(
        private readonly discoverService: DiscoverService,
        private entityManager: EntityManager,
    ) {}

    /**
     * Resolves a field path (e.g., "title" or "manufacturer.name") to a SQL expression.
     * Supports direct fields, embeddables, and n-level deep ManyToOne/OneToOne relations using subqueries.
     */
    private resolveFieldToSql(fieldPath: string, metadata: EntityMetadata, tableName: string): string {
        const parts = fieldPath.split(".");

        // Direct field - find the actual column name
        if (parts.length === 1) {
            const fieldProp = metadata.props.find((p) => p.name === parts[0]);
            if (!fieldProp) {
                throw new Error(`Field "${parts[0]}" not found in entity "${metadata.className}"`);
            }

            return `"${tableName}"."${fieldProp.fieldNames[0]}"`;
        }

        // Relation path - resolve first relation and recurse for the rest
        const [relationName, ...remainingParts] = parts;

        // Find the relation property in metadata
        const relationProp = metadata.props.find((p) => p.name === relationName);

        if (!relationProp) {
            throw new Error(`Relation "${relationName}" not found in entity "${metadata.className}"`);
        }

        // Handle embedded properties - fields are columns on the same table
        if (relationProp.kind === "embedded") {
            let currentProp = relationProp;
            let currentName = relationName;
            for (const part of remainingParts) {
                const childProp = currentProp.embeddedProps?.[part];
                if (!childProp) {
                    throw new Error(`Embedded field "${part}" not found in embeddable "${currentName}" of entity "${metadata.className}"`);
                }
                currentName = part;
                currentProp = childProp;
            }
            return `"${tableName}"."${currentProp.fieldNames[0]}"`;
        }

        if (relationProp.kind !== "m:1" && relationProp.kind !== "1:1") {
            throw new Error(
                `Only ManyToOne, OneToOne relations and embeddables are supported for EntityInfo. "${relationName}" is "${relationProp.kind}"`,
            );
        }

        if (!relationProp.targetMeta) {
            throw new Error(`Relation "${relationName}" has no target metadata`);
        }

        // Get the join column (foreign key) and target table info
        const joinColumn = relationProp.joinColumns[0];
        const targetTableName = relationProp.targetMeta.tableName;
        const targetPrimaryKey = relationProp.targetMeta.primaryKeys[0];

        // Recursively resolve the remaining path in the target entity
        const innerSql = this.resolveFieldToSql(remainingParts.join("."), relationProp.targetMeta, targetTableName);

        return `(SELECT ${innerSql} FROM "${targetTableName}" WHERE "${targetTableName}"."${targetPrimaryKey}" = "${tableName}"."${joinColumn}")`;
    }

    /**
     * Gets the embedded sub-property names and SQL column references for a scope property.
     * Returns null if the entity doesn't have a scope embedded property.
     */
    private getScopeEmbeddedColumns(metadata: EntityMetadata, tableName: string, scopePropName = "scope"): { key: string; sql: string }[] | null {
        const scopeProp = metadata.props.find((p) => p.name === scopePropName);
        if (!scopeProp || scopeProp.kind !== "embedded") return null;

        const columns: { key: string; sql: string }[] = [];
        if (scopeProp.embeddedProps) {
            for (const [propName, prop] of Object.entries(scopeProp.embeddedProps)) {
                columns.push({
                    key: propName,
                    sql: `"${tableName}"."${prop.fieldNames[0]}"`,
                });
            }
        }
        return columns.length > 0 ? columns : null;
    }

    /**
     * Builds a `jsonb_build_object(...)` SQL expression from scope columns.
     */
    private buildScopeJsonbSql(columns: { key: string; sql: string }[]): string {
        const args = columns.map((col) => `'${col.key}', ${col.sql}`).join(", ");
        return `jsonb_build_object(${args})`;
    }

    /**
     * Resolves a ScopedEntity relation path like "company.scope" to scope columns.
     * The path points to a related entity's scope embedded property.
     * Returns the jsonb_build_object SQL expression, or null if unresolvable.
     */
    private resolveScopedEntityRelationPath(path: string, metadata: EntityMetadata, tableName: string): string | null {
        const parts = path.split(".");
        if (parts.length < 2) return null;

        // The last part should be the scope property name on the target entity
        const scopePropName = parts[parts.length - 1];

        // Navigate through the relation chain to find the target entity metadata
        let currentMetadata = metadata;
        let currentTableName = tableName;
        const relationParts = parts.slice(0, -1);

        // Build the subquery chain for relations
        interface JoinInfo {
            targetTableName: string;
            targetPrimaryKey: string;
            joinColumn: string;
            sourceTableName: string;
        }
        const joins: JoinInfo[] = [];

        for (const relationName of relationParts) {
            const relationProp = currentMetadata.props.find((p) => p.name === relationName);
            if (!relationProp) return null;
            if (relationProp.kind !== "m:1" && relationProp.kind !== "1:1") return null;
            if (!relationProp.targetMeta) return null;

            joins.push({
                targetTableName: relationProp.targetMeta.tableName,
                targetPrimaryKey: relationProp.targetMeta.primaryKeys[0],
                joinColumn: relationProp.joinColumns[0],
                sourceTableName: currentTableName,
            });

            currentTableName = relationProp.targetMeta.tableName;
            currentMetadata = relationProp.targetMeta;
        }

        // Get the scope embedded columns from the target entity
        const scopeColumns = this.getScopeEmbeddedColumns(currentMetadata, currentTableName, scopePropName);
        if (!scopeColumns) return null;

        // Build the jsonb at the innermost level
        const innerJsonb = this.buildScopeJsonbSql(scopeColumns);

        // Wrap in subqueries for each relation join (from innermost to outermost)
        let sql = innerJsonb;
        for (let i = joins.length - 1; i >= 0; i--) {
            const join = joins[i];
            sql = `(SELECT ${sql} FROM "${join.targetTableName}" WHERE "${join.targetTableName}"."${join.targetPrimaryKey}" = "${join.sourceTableName}"."${join.joinColumn}")`;
        }

        return sql;
    }

    /**
     * Builds the scope SQL expression for an entity.
     * Returns a SQL expression that produces a JSONB scope value, or "null::jsonb" if no scope is available.
     */
    private buildEntityScopeSql(targetEntity: { entity: AnyEntity; metadata: EntityMetadata }): string {
        const { metadata } = targetEntity;
        const tableName = metadata.tableName;

        // Case 1: Entity has a direct scope embedded property
        const scopeColumns = this.getScopeEmbeddedColumns(metadata, tableName);
        if (scopeColumns) {
            return this.buildScopeJsonbSql(scopeColumns);
        }

        // Case 2: Entity has @ScopedEntity decorator with SQL-convertible format
        const scopedMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, targetEntity.entity) as ScopedEntityMeta | undefined;
        if (scopedMeta) {
            if (isScopedEntitySqlMapping(scopedMeta)) {
                // Record mapping: { scopeKey: "field.path" }
                const columns = Object.entries(scopedMeta).map(([key, fieldPath]) => ({
                    key,
                    sql: this.resolveFieldToSql(fieldPath, metadata, tableName),
                }));
                if (columns.length > 0) {
                    return this.buildScopeJsonbSql(columns);
                }
            } else if (isScopedEntityRelationPath(scopedMeta)) {
                // String relation path: "relation.scope"
                const scopeSql = this.resolveScopedEntityRelationPath(scopedMeta, metadata, tableName);
                if (scopeSql) {
                    return scopeSql;
                }
            } else if (isScopedEntityCallbackOrService(scopedMeta)) {
                // Callback or service: not SQL-convertible
                const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity);
                if (entityInfo) {
                    this.logger.warn(
                        `Entity "${metadata.className}" has @EntityInfo and @ScopedEntity with a callback/service. ` +
                            `The scope cannot be included in the EntityInfo view. ` +
                            `Use a SQL-mappable @ScopedEntity format instead, e.g., @ScopedEntity({ key: "relation.field" }) or @ScopedEntity("relation.scope").`,
                    );
                }
            }
        }

        return "null::jsonb";
    }

    /**
     * Builds the scope SQL expression for a raw SQL EntityInfo entity (like PageTreeNode, DamFile).
     * Joins the source table to get scope columns if available.
     */
    private buildRawEntityInfoScopeSql(metadata: EntityMetadata): { scopeSql: string; joinSql: string } | null {
        const scopeColumns = this.getScopeEmbeddedColumns(metadata, metadata.tableName);
        if (!scopeColumns) return null;

        const primary = metadata.primaryKeys[0];
        return {
            scopeSql: this.buildScopeJsonbSql(scopeColumns),
            joinSql: `JOIN "${metadata.tableName}" ON "${metadata.tableName}"."${primary}"::text = sub."id"`,
        };
    }

    async createEntityInfoView(options?: { pageTreeFullText?: boolean }): Promise<void> {
        const pageTreeFullText = options?.pageTreeFullText ?? false;
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();
        for (const targetEntity of targetEntities) {
            const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity) as EntityInfo<AnyEntity>;
            if (entityInfo) {
                if (typeof entityInfo === "string") {
                    if (pageTreeFullText && targetEntity.metadata.tableName === "PageTreeNode") {
                        // PageTreeNode with fullText: join PageTreeNode for scope
                        const scopeColumns = this.getScopeEmbeddedColumns(targetEntity.metadata, "PageTreeNode");
                        const scopeSql = scopeColumns ? this.buildScopeJsonbSql(scopeColumns) : "null::jsonb";
                        indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeEntityInfo"."id", 'PageTreeNode' AS "entityName", "PageTreeNodeFullText"."fullText", ${scopeSql} AS "scope"
                            FROM "PageTreeNodeEntityInfo"
                            JOIN "PageTreeNode" ON "PageTreeNode"."id"::text = "PageTreeNodeEntityInfo"."id"
                            LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeEntityInfo"."id"::uuid`);
                    } else {
                        // Generic raw SQL EntityInfo: try to get scope from source table
                        const rawScope = this.buildRawEntityInfoScopeSql(targetEntity.metadata);
                        if (rawScope) {
                            indexSelects.push(
                                `SELECT sub.*, null::tsvector AS "fullText", ${rawScope.scopeSql} AS "scope" FROM (${entityInfo}) sub ${rawScope.joinSql}`,
                            );
                        } else {
                            indexSelects.push(`SELECT sub.*, null::tsvector AS "fullText", null::jsonb AS "scope" FROM (${entityInfo}) sub`);
                        }
                    }
                } else {
                    const { entityName, metadata } = targetEntity;
                    const primary = metadata.primaryKeys[0];

                    // Resolve the name field (must not be NULL)
                    const nameSql = `COALESCE(${this.resolveFieldToSql(entityInfo.name, metadata, metadata.tableName)}, '')`;

                    // Resolve the secondaryInformation field (if provided, can be NULL)
                    let secondaryInformationSql = "null";
                    if (entityInfo.secondaryInformation) {
                        secondaryInformationSql = this.resolveFieldToSql(entityInfo.secondaryInformation, metadata, metadata.tableName);
                    }

                    let visibleSql = "true";
                    if (entityInfo.visible) {
                        const qb = this.entityManager.createQueryBuilder(targetEntity.entity.name, metadata.tableName);
                        const query = qb.select("*").where(entityInfo.visible);
                        const sql = query.getFormattedQuery();
                        const sqlWhereMatch = sql.match(/^select .*? from .*? where (.*)/);
                        if (!sqlWhereMatch) {
                            throw new Error(`Could not extract where clause from query: ${sql}`);
                        }
                        visibleSql = sqlWhereMatch[1];
                    }

                    let fullTextSql = "null::tsvector";
                    if (entityInfo.fullText) {
                        fullTextSql = this.resolveFieldToSql(entityInfo.fullText, metadata, metadata.tableName);
                    }

                    // Resolve the scope
                    const scopeSql = this.buildEntityScopeSql(targetEntity);

                    const select = `SELECT
                                ${nameSql} "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                "${metadata.tableName}"."${primary}"::text "id",
                                '${entityName}' "entityName",
                                ${fullTextSql} AS "fullText",
                                ${scopeSql} AS "scope"
                            FROM "${metadata.tableName}"`;
                    indexSelects.push(select);
                }
            }
        }

        // add all PageTreeNode Documents (Page, Link etc) thru PageTreeNodeDocument (no @EntityInfo needed on Page/Link)
        // Find PageTreeNode metadata to get scope columns
        const pageTreeNodeEntity = targetEntities.find((e) => e.metadata.tableName === "PageTreeNode");
        const pageTreeNodeScopeColumns = pageTreeNodeEntity ? this.getScopeEmbeddedColumns(pageTreeNodeEntity.metadata, "PageTreeNode") : null;
        const pageTreeNodeScopeSql = pageTreeNodeScopeColumns ? this.buildScopeJsonbSql(pageTreeNodeScopeColumns) : "null::jsonb";

        if (pageTreeFullText) {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", "PageTreeNodeFullText"."fullText", ${pageTreeNodeScopeSql} AS "scope"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
                JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeDocument"."pageTreeNodeId"
                LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeDocument"."pageTreeNodeId"
            `);
        } else {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", null::tsvector AS "fullText", ${pageTreeNodeScopeSql} AS "scope"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
                ${pageTreeNodeScopeColumns ? `JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeDocument"."pageTreeNodeId"` : ""}
            `);
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating EntityInfo view");
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "EntityInfo"`);
        await this.entityManager.getConnection().execute(`CREATE VIEW "EntityInfo" AS ${viewSql}`);
        console.timeEnd("creating EntityInfo view");
    }

    async dropEntityInfoView() {
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "EntityInfo"`);
    }

    async getEntityInfo(entityName: string, id: string): Promise<EntityInfoObject | undefined> {
        const entityInfo = await this.entityManager.findOne(EntityInfoObject, { id, entityName });

        if (!entityInfo) {
            this.logger.warn(
                `Warning: No entity info found for ${entityName}#${id}. Is the @EntityInfo() decorator missing on the ${entityName} class?`,
            );
            return undefined;
        }

        return entityInfo;
    }
}
