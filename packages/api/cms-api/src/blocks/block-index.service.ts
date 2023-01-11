import { Connection, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

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
                [entity.targetIdentifier]: {
                    entityName: entity.entityName,
                    tableName: entity.metadata.tableName,
                    primary: entity.metadata.primaryKeys[0],
                    graphqlObjectType: entity.graphqlMetadata.objectType,
                },
            };
        }, {});

        for (const rootBlockEntity of this.discoverEntitiesService.discoverRootBlocks()) {
            const { metadata, column, graphqlMetadata, blockIndexRootIdentifier } = rootBlockEntity;
            const primary = metadata.primaryKeys[0];

            const select = `SELECT
                            '${blockIndexRootIdentifier}'         "rootIdentifier",
                            "${metadata.tableName}"."${primary}"  "id",
                            '${metadata.name}'                    "entityName",
                            '${graphqlMetadata.objectType}'       "graphqlObjectType",
                            '${metadata.tableName}'               "tableName",
                            '${column}'                           "columnName",
                            '${primary}'                          "primaryKey",
                            indexObj->>'blockname'                "blockname",
                            indexObj->>'jsonPath'                 "jsonPath",
                            (indexObj->>'visible')::boolean       "visible",
                            targetObj->>'targetIdentifier'        "targetIdentifier",
                            targetTableData->>'entityName'        "targetEntityName",
                            targetTableData->>'graphqlObjectType' "targetGraphqlObjectType",
                            targetTableData->>'tableName'         "targetTableName",
                            targetTableData->>'primary'           "targetPrimaryKey",
                            targetObj->>'id' "targetId"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj,
                            json_array_elements(indexObj->'target') targetObj,
                            json_extract_path('${JSON.stringify(targetEntitiesNameData)}', targetObj->>'targetIdentifier') targetTableData`;

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

    async getDependentsByTargetIdentifierAndTargetId(targetIdentifier: string, targetId: string): Promise<BlockIndexDependency[]> {
        return this.connection.execute(`SELECT * FROM block_index_dependencies as idx WHERE idx."targetIdentifier" = ? AND idx."targetId" = ?`, [
            targetIdentifier,
            targetId,
        ]);
    }

    async getDependenciesByRootIdentifierAndRootId(rootIdentifier: string, rootId: string): Promise<BlockIndexDependency[]> {
        return this.connection.execute(`SELECT * FROM block_index_dependencies as idx WHERE idx."rootIdentifier" = ? AND idx."id" = ?`, [
            rootIdentifier,
            rootId,
        ]);
    }
}
