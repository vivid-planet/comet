import { AnyEntity, Connection, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "./entity-info.decorator";
import { EntityInfoObject } from "./entity-info.object";

@Injectable()
export class EntityInfoService {
    private connection: Connection;
    private readonly logger = new Logger(EntityInfoService.name);

    constructor(
        private readonly discoverService: DiscoverService,
        private entityManager: EntityManager,
    ) {
        this.connection = entityManager.getConnection();
    }

    /**
     * Resolves a field path (e.g., "title" or "manufacturer.name") to a SQL expression.
     * Supports direct fields and n-level deep ManyToOne/OneToOne relations using subqueries.
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

        if (relationProp.kind !== "m:1" && relationProp.kind !== "1:1") {
            throw new Error(`Only ManyToOne and OneToOne relations are supported for EntityInfo. "${relationName}" is "${relationProp.kind}"`);
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

    async createEntityInfoView(): Promise<void> {
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();
        for (const targetEntity of targetEntities) {
            const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity) as EntityInfo<AnyEntity>;
            if (entityInfo) {
                if (typeof entityInfo === "string") {
                    indexSelects.push(entityInfo);
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

                    const select = `SELECT
                                ${nameSql} "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                "${metadata.tableName}"."${primary}"::text "id",
                                '${entityName}' "entityName"
                            FROM "${metadata.tableName}"`;
                    indexSelects.push(select);
                }
            }
        }

        // add all PageTreeNode Documents (Page, Link etc) thru PageTreeNodeDocument (no @EntityInfo needed on Page/Link)
        indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName"
            FROM "PageTreeNodeDocument"
            JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
        `);

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating EntityInfo view");
        await this.connection.execute(`DROP VIEW IF EXISTS "EntityInfo"`);
        await this.connection.execute(`CREATE VIEW "EntityInfo" AS ${viewSql}`);
        console.timeEnd("creating EntityInfo view");
    }

    async dropEntityInfoView() {
        await this.connection.execute(`DROP VIEW IF EXISTS "EntityInfo"`);
    }

    async getEntityInfo(entityName: string, id: string): Promise<EntityInfoObject | undefined> {
        const qb = this.entityManager
            .getKnex("read")
            .select<EntityInfoObject>(["name", "secondaryInformation"])
            .from("EntityInfo")
            .where({ id, entityName });

        const entityInfo = await qb.first();

        if (entityInfo === undefined) {
            this.logger.warn(
                `Warning: No entity info found for ${entityName}#${id}. Is the @EntityInfo() decorator missing on the ${entityName} class?`,
            );
            return undefined;
        }

        return entityInfo;
    }
}
