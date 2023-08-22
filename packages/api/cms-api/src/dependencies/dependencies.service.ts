import { AnyEntity, Connection } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { Dependency } from "./dependency";
import { DiscoverService } from "./discover.service";

@Injectable()
export class DependenciesService {
    private entityManager: EntityManager;
    private connection: Connection;

    constructor(entityManager: EntityManager, private readonly discoverService: DiscoverService) {
        this.entityManager = entityManager;
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();

        const targetEntitiesNameData = targetEntities.reduce((obj, entity) => {
            return {
                ...obj,
                [entity.entityName]: {
                    entityName: entity.entityName,
                    tableName: entity.metadata.tableName,
                    primary: entity.metadata.primaryKeys[0],
                    graphqlObjectType: entity.graphqlObjectType,
                },
            };
        }, {});

        for (const rootBlockEntity of this.discoverService.discoverRootBlocks()) {
            const { metadata, column, graphqlObjectType } = rootBlockEntity;
            const primary = metadata.primaryKeys[0];

            const select = `SELECT
                            "${metadata.tableName}"."${primary}"  "rootId",
                            '${metadata.name}'                    "rootEntityName",
                            '${graphqlObjectType}'                "rootGraphqlObjectType",
                            '${metadata.tableName}'               "rootTableName",
                            '${column}'                           "rootColumnName",
                            '${primary}'                          "rootPrimaryKey",
                            indexObj->>'blockname'                "blockname",
                            indexObj->>'jsonPath'                 "jsonPath",
                            (indexObj->>'visible')::boolean       "visible",
                            targetTableData->>'entityName'        "targetEntityName",
                            targetTableData->>'graphqlObjectType' "targetGraphqlObjectType",
                            targetTableData->>'tableName'         "targetTableName",
                            targetTableData->>'primary'           "targetPrimaryKey",
                            dependenciesObj->>'id' "targetId"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj,
                            json_array_elements(indexObj->'dependencies') dependenciesObj,
                            json_extract_path('${JSON.stringify(targetEntitiesNameData)}', dependenciesObj->>'targetEntityName') targetTableData`;

            indexSelects.push(select);
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating block dependency materialized view");
        await this.connection.execute(`DROP MATERIALIZED VIEW IF EXISTS block_index_dependencies`);
        await this.connection.execute(`CREATE MATERIALIZED VIEW block_index_dependencies AS ${viewSql}`);
        console.timeEnd("creating block dependency materialized view");

        console.time("creating block dependency materialized view index");
        await this.connection.execute(`CREATE INDEX block_index_dependencies_targetId ON block_index_dependencies ("targetId")`);
        console.timeEnd("creating block dependency materialized view index");
    }

    async refreshViews(): Promise<void> {
        console.time("refresh materialized block dependency");
        await this.connection.execute("REFRESH MATERIALIZED VIEW block_index_dependencies");
        console.timeEnd("refresh materialized block dependency");
    }

    async getDependents(
        target: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: {
            rootGraphqlObjectType?: string;
            rootEntityName?: string;
            rootId?: string;
            rootColumnName?: string;
        },
    ): Promise<Dependency[]> {
        await this.refreshViews();

        const entityName = "entityName" in target ? target.entityName : target.constructor.name;
        const qb = this.entityManager.getKnex("read").select("*").from({ idx: "block_index_dependencies" }).where({
            targetEntityName: entityName,
            targetId: target.id,
        });

        if (filter?.rootGraphqlObjectType) {
            qb.andWhere({ rootGraphqlObjectType: filter.rootGraphqlObjectType });
        }
        if (filter?.rootEntityName) {
            qb.andWhere({ rootEntityName: filter.rootEntityName });
        }
        if (filter?.rootId) {
            qb.andWhere({ rootId: filter.rootId });
        }
        if (filter?.rootColumnName) {
            qb.andWhere({ rootColumnName: filter.rootColumnName });
        }

        const results: Dependency[] = await qb;
        return results;
    }

    async getDependencies(
        root: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: {
            targetGraphqlObjectType?: string;
            targetEntityName?: string;
            targetId?: string;
            rootColumnName?: string;
        },
    ): Promise<Dependency[]> {
        await this.refreshViews();

        const entityName = "entityName" in root ? root.entityName : root.constructor.name;
        const qb = this.entityManager.getKnex("read").select("*").from({ idx: "block_index_dependencies" }).where({
            rootEntityName: entityName,
            rootId: root.id,
        });

        if (filter?.targetGraphqlObjectType) {
            qb.andWhere({ targetGraphqlObjectType: filter.targetGraphqlObjectType });
        }
        if (filter?.targetEntityName) {
            qb.andWhere({ targetEntityName: filter.targetEntityName });
        }
        if (filter?.targetId) {
            qb.andWhere({ targetId: filter.targetId });
        }
        if (filter?.rootColumnName) {
            qb.andWhere({ rootColumnName: filter.rootColumnName });
        }

        const results: Dependency[] = await qb;
        return results;
    }
}
