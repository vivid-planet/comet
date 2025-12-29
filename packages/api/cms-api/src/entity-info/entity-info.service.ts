import { AnyEntity, Connection, EntityManager } from "@mikro-orm/postgresql";
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

                    let secondaryInformationSql = "null";
                    if (entityInfo.secondaryInformation) {
                        secondaryInformationSql = entityInfo.secondaryInformation;
                    }

                    let visibleSql = "true";
                    if (entityInfo.visible) {
                        const qb = this.entityManager.createQueryBuilder(targetEntity.entity.name, "t");
                        const query = qb.select("*").where(entityInfo.visible);
                        const sql = query.getFormattedQuery();
                        const sqlWhereMatch = sql.match(/^select .*? from .*? where (.*)/);
                        if (!sqlWhereMatch) {
                            throw new Error(`Could not extract where clause from query: ${sql}`);
                        }
                        visibleSql = sqlWhereMatch[1];
                    }

                    const select = `SELECT
                                "${entityInfo.name}" "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                t."${primary}"::text "id",
                                '${entityName}' "entityName"
                            FROM "${metadata.tableName}" t`;
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
