import { Connection, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import * as console from "console";

import { BlockIndexDependency } from "./block-index-dependency";
import { DiscoverService } from "./discover.service";

@Injectable()
export class BlockIndexService {
    private entityManager: EntityManager;
    private connection: Connection;

    constructor(entityManager: EntityManager, private readonly discoverEntitiesService: DiscoverService) {
        this.entityManager = entityManager;
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        const indexSelects: string[] = [];
        const targetEntities = this.discoverEntitiesService.discoverTargetEntities();

        const targetEntitiesNameData = targetEntities.reduce((obj, entity) => {
            return {
                ...obj,
                [entity.entityName]: {
                    entityName: entity.entityName,
                    tableName: entity.metadata.tableName,
                    primary: entity.metadata.primaryKeys[0],
                    graphqlObjectType: entity.graphqlMetadata.objectType,
                },
            };
        }, {});

        for (const rootBlockEntity of this.discoverEntitiesService.discoverRootBlocks()) {
            const { metadata, column, graphqlMetadata } = rootBlockEntity;
            const primary = metadata.primaryKeys[0];

            const select = `SELECT
                            "${metadata.tableName}"."${primary}"  "rootId",
                            '${metadata.name}'                    "rootEntityName",
                            '${graphqlMetadata.objectType}'       "rootGraphqlObjectType",
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
                            json_array_elements(indexObj->'target'->'dependencies') dependenciesObj,
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

    async getDependentsByTargetEntityNameAndTargetId(targetEntityName: string, targetId: string): Promise<BlockIndexDependency[]> {
        return this.connection.execute(`SELECT * FROM block_index_dependencies as idx WHERE idx."targetEntityName" = ? AND idx."targetId" = ?`, [
            targetEntityName,
            targetId,
        ]);
    }

    async getDependenciesByRootEntityNameAndRootId(rootEntityName: string, rootId: string): Promise<BlockIndexDependency[]> {
        return this.connection.execute(`SELECT * FROM block_index_dependencies as idx WHERE idx."rootEntityName" = ? AND idx."rootId" = ?`, [
            rootEntityName,
            rootId,
        ]);
    }
}
