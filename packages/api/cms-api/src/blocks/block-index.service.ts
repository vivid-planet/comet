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
        const damFilesIndexSelects: string[] = [];
        for (const discoveredEntity of this.discoverEntitiesService.discoverRootBlocks()) {
            const { metadata, column } = discoveredEntity;
            const primary = metadata.primaryKeys[0];

            const select = `SELECT "${metadata.tableName}"."${primary}" id,
                            '${metadata.tableName}' "tableName",
                            '${column}' "columnName",
                            '${primary}' "primaryKey",
                            index->>'blockname' "blockname",
                            index->>'jsonPath' "jsonPath",
                            (index->>'visible')::boolean "visible",
                            files "damFileId"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') index,
                            json_array_elements_text("index"->'damFileIds') files`;
            damFilesIndexSelects.push(select);
        }

        const viewSql = damFilesIndexSelects.join("\n UNION ALL \n");

        console.time("creating block damFiles materialized view");
        await this.connection.execute(`DROP MATERIALIZED VIEW IF EXISTS block_index_damfiles`);
        await this.connection.execute(`CREATE MATERIALIZED VIEW block_index_damfiles AS ${viewSql}`);
        console.timeEnd("creating block damFiles materialized view");

        console.time("creating block damFiles materialized view index");
        await this.connection.execute(`CREATE INDEX block_index_damfiles_damfileid ON block_index_damfiles ("damFileId")`);
        console.timeEnd("creating block damFiles materialized view index");
    }

    async refreshViews(): Promise<void> {
        console.time("refresh materialized block damFiles");
        await this.connection.execute("REFRESH MATERIALIZED VIEW block_index_damfiles");
        console.timeEnd("refresh materialized block damFiles");
    }
}
