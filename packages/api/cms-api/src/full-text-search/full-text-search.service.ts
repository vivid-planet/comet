import { AnyEntity, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Optional } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "../entity-info/entity-info.decorator";
import { resolveFieldToSql } from "../entity-info/resolve-field-to-sql";
import { PageTreeFullTextService } from "../page-tree/fullText/page-tree-full-text.service";
import {
    isScopedEntitySqlPath,
    SCOPED_ENTITY_METADATA_KEY,
    ScopedEntityMeta,
    ScopedEntitySqlPath,
} from "../user-permissions/decorators/scoped-entity.decorator";

@Injectable()
export class FullTextSearchService {
    constructor(
        private readonly discoverService: DiscoverService,
        private entityManager: EntityManager,
        @Optional() private readonly pageTreeFullTextService?: PageTreeFullTextService,
    ) {}

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

        // Validate: if @ScopedEntity is a callback/service AND @EntityInfo with fullText is present, that's an error
        const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, entity) as EntityInfo<AnyEntity> | undefined;
        if (scopedEntityMeta && entityInfo && typeof entityInfo !== "string" && entityInfo.fullText) {
            throw new Error(
                `Entity "${metadata.className}" uses @EntityInfo with fullText together with a callback/service-based @ScopedEntity. ` +
                    `When fullText search is used, @ScopedEntity must use the SQL-path format ` +
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
            const parts = sqlPath.split(".");
            let currentMeta = metadata;
            let tableName = metadata.tableName;
            const subqueryParts: { joinColumn: string; targetTable: string; targetPk: string; sourceTable: string }[] = [];

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const prop = currentMeta.props.find((p) => p.name === part);
                if (!prop) {
                    throw new Error(
                        `Property "${part}" not found in entity "${currentMeta.className}" while resolving @ScopedEntity path "${sqlPath}"`,
                    );
                }

                if (prop.kind === "embedded" && prop.embeddedProps) {
                    const remaining = parts.slice(i + 1);
                    if (remaining.length === 0) {
                        if (subqueryParts.length === 0) {
                            return this.buildScopeJsonSql(prop.embeddedProps, tableName);
                        } else {
                            return this.wrapInSubqueries(this.buildScopeJsonSql(prop.embeddedProps, tableName), subqueryParts);
                        }
                    }
                    let currentProp = prop;
                    for (const remainPart of remaining) {
                        const childProp = currentProp.embeddedProps?.[remainPart];
                        if (!childProp) {
                            throw new Error(
                                `Embedded field "${remainPart}" not found while resolving @ScopedEntity path "${sqlPath}" in entity "${metadata.className}"`,
                            );
                        }
                        if (childProp.embeddedProps) {
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
                const fieldSql = resolveFieldToSql(fieldPath, metadata, metadata.tableName);
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
                    // Resolve scope from the PageTreeNode entity
                    const scopeSql = this.resolveScopeToSql(targetEntity.entity, targetEntity.metadata);
                    // Need to reference PageTreeNode table for scope, so JOIN it
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
            const scopeSql = this.resolveScopeToSql(targetEntity.entity, metadata);

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
}
