import { AnyEntity, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import {
    isScopedEntitySqlPath,
    SCOPED_ENTITY_METADATA_KEY,
    ScopedEntityMeta,
    ScopedEntitySqlPath,
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
    resolveFieldToSql(fieldPath: string, metadata: EntityMetadata, tableName: string): string {
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
     * Resolves the scope for an entity to a SQL expression returning a JSON object.
     *
     * The scope can come from:
     * 1. A direct embedded `scope` property on the entity
     * 2. A SQL-path format `@ScopedEntity` decorator (string or object)
     *
     * Returns a SQL expression that produces a JSON object, or `"null::jsonb"` if no scope is resolvable.
     */
    private resolveScopeToSql(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entity: any,
        metadata: EntityMetadata,
    ): string {
        // Check for direct scope embedded property
        const scopeProp = metadata.props.find((p) => p.name === "scope");
        if (scopeProp && scopeProp.kind === "embedded" && scopeProp.embeddedProps) {
            return this.buildScopeJsonSql(scopeProp.embeddedProps, metadata.tableName);
        }

        // Check for SQL-path @ScopedEntity decorator
        const scopedEntityMeta = Reflect.getMetadata(SCOPED_ENTITY_METADATA_KEY, entity) as ScopedEntityMeta | undefined;
        if (scopedEntityMeta && isScopedEntitySqlPath(scopedEntityMeta)) {
            return this.resolveScopedEntitySqlPathToSql(scopedEntityMeta, metadata);
        }

        // Validate: if @ScopedEntity is a callback/service AND @EntityInfo is present, that's an error
        if (scopedEntityMeta) {
            throw new Error(
                `Entity "${metadata.className}" uses @EntityInfo together with a callback/service-based @ScopedEntity. ` +
                    `When @EntityInfo is used, @ScopedEntity must use the SQL-path format ` +
                    `(e.g. @ScopedEntity("relation.scope") or @ScopedEntity({ field: "relation.field" })) ` +
                    `so the scope can be resolved in SQL.`,
            );
        }

        return "null::jsonb";
    }

    /**
     * Builds a JSON object SQL expression from embedded scope properties.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private buildScopeJsonSql(embeddedProps: Record<string, any>, tableName: string): string {
        const jsonParts: string[] = [];
        for (const [propName, propMeta] of Object.entries(embeddedProps)) {
            if (propMeta.fieldNames?.[0]) {
                jsonParts.push(`'${propName}', "${tableName}"."${propMeta.fieldNames[0]}"`);
            }
        }
        if (jsonParts.length === 0) {
            return "null::jsonb";
        }
        return `jsonb_build_object(${jsonParts.join(", ")})`;
    }

    /**
     * Resolves a ScopedEntitySqlPath to a SQL JSON expression.
     *
     * - String form (e.g. "company.scope"): resolves the path to an embedded scope and builds JSON from its fields
     * - Object form (e.g. { companyId: "company.id" }): builds JSON from individual field paths
     */
    private resolveScopedEntitySqlPathToSql(sqlPath: ScopedEntitySqlPath, metadata: EntityMetadata): string {
        if (typeof sqlPath === "string") {
            // String form: path to an embedded scope object
            // We need to resolve each field in the embedded scope
            const parts = sqlPath.split(".");
            let currentMeta = metadata;
            let tableName = metadata.tableName;
            const subqueryParts: { joinColumn: string; targetTable: string; targetPk: string; sourceTable: string }[] = [];

            // Walk the path to find the embedded scope
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const prop = currentMeta.props.find((p) => p.name === part);
                if (!prop) {
                    throw new Error(
                        `Property "${part}" not found in entity "${currentMeta.className}" while resolving @ScopedEntity path "${sqlPath}"`,
                    );
                }

                if (prop.kind === "embedded" && prop.embeddedProps) {
                    // If there are remaining parts, drill into the embedded
                    const remaining = parts.slice(i + 1);
                    if (remaining.length === 0) {
                        // This is the scope object itself - build JSON from its fields
                        if (subqueryParts.length === 0) {
                            return this.buildScopeJsonSql(prop.embeddedProps, tableName);
                        } else {
                            // Scope is in a related entity - wrap in subquery
                            return this.wrapInSubqueries(this.buildScopeJsonSql(prop.embeddedProps, tableName), subqueryParts);
                        }
                    }
                    // Drill into nested embeddable
                    let currentProp = prop;
                    for (const remainPart of remaining) {
                        const childProp = currentProp.embeddedProps?.[remainPart];
                        if (!childProp) {
                            throw new Error(
                                `Embedded field "${remainPart}" not found while resolving @ScopedEntity path "${sqlPath}" in entity "${metadata.className}"`,
                            );
                        }
                        if (childProp.embeddedProps) {
                            // This is an embedded scope object
                            if (subqueryParts.length === 0) {
                                return this.buildScopeJsonSql(childProp.embeddedProps, tableName);
                            } else {
                                return this.wrapInSubqueries(this.buildScopeJsonSql(childProp.embeddedProps, tableName), subqueryParts);
                            }
                        }
                        currentProp = childProp;
                    }
                    throw new Error(`Path "${sqlPath}" does not resolve to an embedded scope object in entity "${metadata.className}"`);
                }

                if (prop.kind === "m:1" || prop.kind === "1:1") {
                    if (!prop.targetMeta) {
                        throw new Error(`Relation "${part}" has no target metadata in entity "${currentMeta.className}"`);
                    }
                    subqueryParts.push({
                        joinColumn: prop.joinColumns[0],
                        targetTable: prop.targetMeta.tableName,
                        targetPk: prop.targetMeta.primaryKeys[0],
                        sourceTable: tableName,
                    });
                    tableName = prop.targetMeta.tableName;
                    currentMeta = prop.targetMeta;
                    continue;
                }

                throw new Error(
                    `Unsupported property kind "${prop.kind}" for "${part}" while resolving @ScopedEntity path "${sqlPath}" in entity "${metadata.className}"`,
                );
            }

            throw new Error(`Path "${sqlPath}" did not resolve to an embedded scope in entity "${metadata.className}"`);
        } else {
            // Object form: build JSON from individual field paths
            const jsonParts: string[] = [];
            for (const [scopeField, fieldPath] of Object.entries(sqlPath)) {
                const fieldSql = this.resolveFieldToSql(fieldPath, metadata, metadata.tableName);
                jsonParts.push(`'${scopeField}', ${fieldSql}`);
            }
            if (jsonParts.length === 0) {
                return "null::jsonb";
            }
            return `jsonb_build_object(${jsonParts.join(", ")})`;
        }
    }

    /**
     * Wraps a SQL expression in nested subqueries for related entities.
     */
    private wrapInSubqueries(
        innerSql: string,
        subqueryParts: { joinColumn: string; targetTable: string; targetPk: string; sourceTable: string }[],
    ): string {
        let result = innerSql;
        for (let i = subqueryParts.length - 1; i >= 0; i--) {
            const { joinColumn, targetTable, targetPk, sourceTable } = subqueryParts[i];
            result = `(SELECT ${result} FROM "${targetTable}" WHERE "${targetTable}"."${targetPk}" = "${sourceTable}"."${joinColumn}")`;
        }
        return result;
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
                        // For PageTreeNode, resolve scope from the entity metadata (the scope is on the PageTreeNode table, not the view)
                        const pageTreeScopeSql = this.resolveScopeToSql(targetEntity.entity, targetEntity.metadata);
                        indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeEntityInfo"."id", 'PageTreeNode' AS "entityName", "PageTreeNodeFullText"."fullText", ${pageTreeScopeSql} AS "scope"
                            FROM "PageTreeNodeEntityInfo"
                            JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeEntityInfo"."id"::uuid
                            LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeEntityInfo"."id"::uuid`);
                    } else {
                        indexSelects.push(`SELECT sub.*, null::tsvector AS "fullText", null::jsonb AS "scope" FROM (${entityInfo}) sub`);
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

                    // Resolve scope to SQL
                    const scopeSql = this.resolveScopeToSql(targetEntity.entity, metadata);

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
        // Resolve scope from the PageTreeNode entity if available
        const pageTreeEntity = targetEntities.find((e) => e.metadata.tableName === "PageTreeNode");
        const pageTreeDocScopeSql = pageTreeEntity ? this.resolveScopeToSql(pageTreeEntity.entity, pageTreeEntity.metadata) : "null::jsonb";

        if (pageTreeFullText) {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", "PageTreeNodeFullText"."fullText", ${pageTreeDocScopeSql} AS "scope"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
                JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeDocument"."pageTreeNodeId"
                LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeDocument"."pageTreeNodeId"
            `);
        } else {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", null::tsvector AS "fullText", ${pageTreeDocScopeSql} AS "scope"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
                JOIN "PageTreeNode" ON "PageTreeNode"."id" = "PageTreeNodeDocument"."pageTreeNodeId"
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
