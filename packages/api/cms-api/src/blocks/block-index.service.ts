import { Connection, EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { DiscoverService } from "./discover.service";

@Injectable()
export class BlockIndexService {
    private connection: Connection;

    constructor(entityManager: EntityManager, private readonly discoverEntitiesService: DiscoverService) {
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        const indexSelects: string[] = [];
        const allEntities = this.discoverEntitiesService.discoverAllEntities();
        // const allEntitiesNameData = allEntities.map((entity) => ({ entityName: entity.metadata.name, tableName: entity.metadata.tableName }));
        const allEntitiesNameData = allEntities.reduce((obj, entity) => {
            return { ...obj, [entity.metadata.name as string]: { tableName: entity.metadata.tableName, primary: entity.metadata.primaryKeys[0] } };
        }, {});

        console.log("allEntitiesNameData ", allEntitiesNameData);
        console.log("json allEntitiesNameData ", JSON.stringify(allEntitiesNameData));

        for (const rootBlockEntity of this.discoverEntitiesService.discoverRootBlocks()) {
            const { metadata, column } = rootBlockEntity;
            const primary = metadata.primaryKeys[0];

            const select = `SELECT 
                            "${metadata.tableName}"."${primary}" id,
                            '${metadata.name}' "entityName",
                            '${metadata.tableName}' "tableName",
                            '${column}' "columnName",
                            '${primary}' "primaryKey",
                            index->>'blockname' "blockname",
                            index->>'jsonPath' "jsonPath",
                            (index->>'visible')::boolean "visible",
                            target->>'entityName' "targetEntityName",
                            targetTableData->>'tableName' "targetTableName",
                            targetTableData->>'primary' "targetPrimaryKey",
                            target->>'id' "targetId"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') index,
                            json_array_elements("index"->'target') target,
                            jsonb_extract_path('${JSON.stringify(allEntitiesNameData)}', target->>'entityName') targetTableData`;

            console.log(select);
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
}
