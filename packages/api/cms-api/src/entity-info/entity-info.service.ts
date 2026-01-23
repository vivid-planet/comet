import { AnyEntity, Connection, EntityManager, EntityMetadata } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";

import { DiscoverService } from "../dependencies/discover.service";
import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "./entity-info.decorator";
import { EntityInfoObject } from "./entity-info.object";

interface FieldSqlResult {
    sql: string;
    joins: string[];
}

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
     * Resolves a field (e.g., "title") or field path for relations (e.g., "manufacturer.name") to SQL expression.
     * Supports direct fields and one level of ManyToOne/OneToOne relations.
     */
    private resolveFieldToSql(fieldPath: string, metadata: EntityMetadata, mainAlias: string, options?: { allowNull?: boolean }): FieldSqlResult {
        const joins: string[] = [];

        // Check if it's a relation path (contains a dot)
        if (fieldPath.includes(".")) {
            const [relationName, fieldName] = fieldPath.split(".");

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

            // Find the target field property
            const targetFieldProp = relationProp.targetMeta.props.find((p) => p.name === fieldName);
            if (!targetFieldProp) {
                throw new Error(`Field "${fieldName}" not found in related entity "${relationProp.targetMeta.className}"`);
            }

            const relationAlias = `${mainAlias}_${relationName}`;
            const targetFieldColumn = targetFieldProp.fieldNames[0];

            // Create the LEFT JOIN clause
            const joinSql = `LEFT JOIN "${targetTableName}" "${relationAlias}" ON "${mainAlias}"."${joinColumn}" = "${relationAlias}"."${targetPrimaryKey}"`;
            joins.push(joinSql);

            // Use COALESCE to ensure non-null values for required fields
            const fieldSql = `"${relationAlias}"."${targetFieldColumn}"`;
            const sql = options?.allowNull ? fieldSql : `COALESCE(${fieldSql}, '')`;

            return {
                sql,
                joins,
            };
        } else {
            // Direct field - find the actual column name
            const fieldProp = metadata.props.find((p) => p.name === fieldPath);
            if (!fieldProp) {
                throw new Error(`Field "${fieldPath}" not found in entity "${metadata.className}"`);
            }

            const columnName = fieldProp.fieldNames[0];
            const fieldSql = `"${mainAlias}"."${columnName}"`;
            const sql = options?.allowNull ? fieldSql : `COALESCE(${fieldSql}, '')`;

            return {
                sql,
                joins: [],
            };
        }
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
                    const mainAlias = "t";
                    const allJoins: string[] = [];

                    // Resolve the name field (must not be NULL)
                    const nameResult = this.resolveFieldToSql(entityInfo.name, metadata, mainAlias);
                    const nameSql = nameResult.sql;
                    allJoins.push(...nameResult.joins);

                    // Resolve the secondaryInformation field (if provided, can be NULL)
                    let secondaryInformationSql = "null";
                    if (entityInfo.secondaryInformation) {
                        const secondaryResult = this.resolveFieldToSql(entityInfo.secondaryInformation, metadata, mainAlias, { allowNull: true });
                        secondaryInformationSql = secondaryResult.sql;
                        allJoins.push(...secondaryResult.joins);
                    }

                    let visibleSql = "true";
                    if (entityInfo.visible) {
                        const qb = this.entityManager.createQueryBuilder(targetEntity.entity.name, mainAlias);
                        const query = qb.select("*").where(entityInfo.visible);
                        const sql = query.getFormattedQuery();
                        const sqlWhereMatch = sql.match(/^select .*? from .*? where (.*)/);
                        if (!sqlWhereMatch) {
                            throw new Error(`Could not extract where clause from query: ${sql}`);
                        }
                        visibleSql = sqlWhereMatch[1];
                    }

                    // Build unique joins (avoid duplicates if same relation is used for name and secondaryInformation)
                    const uniqueJoins = [...new Set(allJoins)];
                    const joinsSql = uniqueJoins.length > 0 ? `\n${uniqueJoins.join("\n")}` : "";

                    const select = `SELECT
                                ${nameSql} "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                ${mainAlias}."${primary}"::text "id",
                                '${entityName}' "entityName"
                            FROM "${metadata.tableName}" ${mainAlias} ${joinsSql}`;
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
