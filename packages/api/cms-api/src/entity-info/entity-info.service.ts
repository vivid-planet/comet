import { AnyEntity, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
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

    async createEntityInfoView(options?: { pageTreeFullText?: boolean }): Promise<void> {
        const pageTreeFullText = options?.pageTreeFullText ?? false;
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();
        for (const targetEntity of targetEntities) {
            const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity) as EntityInfo<AnyEntity>;
            if (entityInfo) {
                if (typeof entityInfo === "string") {
                    if (pageTreeFullText && targetEntity.metadata.tableName === "PageTreeNode") {
                        indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeEntityInfo"."id", 'PageTreeNode' AS "entityName", "PageTreeNodeFullText"."fullText"
                            FROM "PageTreeNodeEntityInfo"
                            LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeEntityInfo"."id"::uuid`);
                    } else {
                        indexSelects.push(`SELECT sub.*, null::tsvector AS "fullText" FROM (${entityInfo}) sub`);
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

                    const select = `SELECT
                                ${nameSql} "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                "${metadata.tableName}"."${primary}"::text "id",
                                '${entityName}' "entityName",
                                ${fullTextSql} AS "fullText"
                            FROM "${metadata.tableName}"`;
                    indexSelects.push(select);
                }
            }
        }

        // add all PageTreeNode Documents (Page, Link etc) thru PageTreeNodeDocument (no @EntityInfo needed on Page/Link)
        if (pageTreeFullText) {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", "PageTreeNodeFullText"."fullText"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
                LEFT JOIN "PageTreeNodeFullText" ON "PageTreeNodeFullText"."pageTreeNodeId" = "PageTreeNodeDocument"."pageTreeNodeId"
            `);
        } else {
            indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName", null::tsvector AS "fullText"
                FROM "PageTreeNodeDocument"
                JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
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
