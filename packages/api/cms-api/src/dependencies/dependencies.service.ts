import { AnyEntity, Connection, EntityManager, Knex } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { subMinutes } from "date-fns";
import { v4 as uuid } from "uuid";

import { EntityInfoService } from "../common/entityInfo/entity-info.service";
import { DiscoverService } from "./discover.service";
import { BaseDependencyInterface } from "./dto/base-dependency.interface";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { Dependency } from "./dto/dependency";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

interface PGStatActivity {
    pid: number;
    state: string;
    query: string;
}

// Advisory lock key for block_index_dependencies refresh deduplication.
// Uses the two-integer form pg_try_advisory_xact_lock(key1, key2) to avoid collisions.
const BLOCK_INDEX_REFRESH_LOCK_KEY1 = 42;
const BLOCK_INDEX_REFRESH_LOCK_KEY2 = 1;

@Injectable()
export class DependenciesService {
    private connection: Connection;
    private readonly logger = new Logger(DependenciesService.name);

    constructor(
        private readonly discoverService: DiscoverService,
        private readonly entityInfoService: EntityInfoService,
        private entityManager: EntityManager,
    ) {
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        await this.createDependenciesView();
        await this.createBlockIndexView();
    }

    private async createDependenciesView(): Promise<void> {
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
        await this.connection.execute(
            `CREATE UNIQUE INDEX ON block_index_dependencies ("rootId", "rootTableName", "rootColumnName", "blockname", "jsonPath", "targetTableName", "targetId")`,
        );
        console.timeEnd("creating block dependency materialized view");

        console.time("creating block dependency materialized view index");
        await this.connection.execute(`CREATE INDEX block_index_dependencies_targetId ON block_index_dependencies ("targetId")`);
        console.timeEnd("creating block dependency materialized view index");
    }

    private async createBlockIndexView(): Promise<void> {
        const indexSelects: string[] = [];

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
                            (indexObj->>'visible')::boolean       "visible"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj`;

            indexSelects.push(select);
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating block index view");
        await this.connection.execute(`DROP VIEW IF EXISTS block_index`);
        await this.connection.execute(`CREATE VIEW block_index AS ${viewSql}`);
        console.timeEnd("creating block index view");
    }

    async refreshViews(options?: { force?: boolean; awaitRefresh?: boolean }): Promise<void> {
        const knex = this.entityManager.getKnex("write");

        const refresh = async (refreshOptions?: { concurrently: boolean }): Promise<boolean> => {
            return knex.transaction(async (trx) => {
                const lockResult = await trx.raw(`SELECT pg_try_advisory_xact_lock(?, ?) AS locked`, [
                    BLOCK_INDEX_REFRESH_LOCK_KEY1,
                    BLOCK_INDEX_REFRESH_LOCK_KEY2,
                ]);

                if (!lockResult.rows[0]?.locked) {
                    // Another refresh is in progress
                    return false;
                }

                const id = uuid();
                this.logger.log(`Starting block index refresh ${id}`);

                await trx("BlockIndexRefresh").insert({ id, startedAt: new Date(), finishedAt: null });

                await trx.raw(
                    `REFRESH MATERIALIZED VIEW ${refreshOptions?.concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`,
                );

                await trx("BlockIndexRefresh").where({ id }).update({ finishedAt: new Date() });

                this.logger.log(`Completed block index refresh ${id}`);
                return true;
            });
        };

        if (options?.force) {
            // Cancel any active refresh queries
            const activeRefreshes: PGStatActivity[] = await this.entityManager
                .getKnex("read")
                .select("pid", "state", "query")
                .from("pg_stat_activity")
                .where({ state: "active" })
                .andWhereILike("query", "REFRESH MATERIALIZED VIEW%")
                .andWhereILike("query", "%block_index_dependencies%");

            for (const activeRefresh of activeRefreshes) {
                await knex.raw(`SELECT pg_cancel_backend(?)`, [activeRefresh.pid]);
            }

            // Use blocking advisory lock to wait for cancelled refresh to release
            await knex.transaction(async (trx) => {
                await trx.raw(`SELECT pg_advisory_xact_lock(?, ?)`, [BLOCK_INDEX_REFRESH_LOCK_KEY1, BLOCK_INDEX_REFRESH_LOCK_KEY2]);
                await trx("BlockIndexRefresh").truncate();
                await trx.raw(`REFRESH MATERIALIZED VIEW block_index_dependencies`);
                await trx("BlockIndexRefresh").insert({ id: uuid(), startedAt: new Date(), finishedAt: new Date() });
            });

            return;
        }

        const lastRefresh = await this.entityManager
            .getKnex("read")
            .select("*")
            .from("BlockIndexRefresh")
            .whereNotNull("finishedAt")
            .orderBy("finishedAt", "desc")
            .first();

        if (!lastRefresh) {
            // First refresh -> refresh sync
            await refresh();
            return;
        }

        const finishedAt = new Date(lastRefresh.finishedAt);
        const now = new Date();

        if (finishedAt > subMinutes(now, 5)) {
            // Newer than 5 minutes -> don't refresh
            return;
        } else if (finishedAt > subMinutes(now, 15)) {
            // Between 5 and 15 minutes -> refresh concurrently (async)
            const refreshPromise = refresh({ concurrently: true });
            if (options?.awaitRefresh) {
                await refreshPromise;
            }
        } else {
            // Older than 15 minutes -> refresh sync
            await refresh();
        }
    }

    async getDependents(
        target: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: DependentFilter & {
            rootEntityName?: string;
        },
        paginationArgs?: { offset: number; limit: number },
        options?: { forceRefresh: boolean },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews({ force: options?.forceRefresh });

        const entityName = "entityName" in target ? target.entityName : target.constructor.name;

        const qb = this.getQueryBuilderWithFilters(
            {
                ...filter,
                targetEntityName: entityName,
                targetId: target.id,
            },
            paginationArgs,
        );

        const results: BaseDependencyInterface[] = await qb;
        const ret: Dependency[] = [];

        for (const result of results) {
            const repository = this.entityManager.getRepository(result.rootEntityName);
            const instance = await repository.findOne({ [result.rootPrimaryKey]: result.rootId });

            let dependency: Dependency = result;
            if (instance) {
                const entityInfo = await this.entityInfoService.getEntityInfo(instance);
                dependency = { ...dependency, ...entityInfo };
            }
            ret.push(dependency);
        }

        const countResult = await this.withCount(qb).select("targetId").groupBy(["targetId", "targetEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(ret, Number(totalCount));
    }

    async getDependencies(
        root: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: DependencyFilter & {
            targetEntityName?: string;
        },
        paginationArgs?: { offset: number; limit: number },
        options?: { forceRefresh: boolean },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews({ force: options?.forceRefresh });

        const entityName = "entityName" in root ? root.entityName : root.constructor.name;

        const qb = this.getQueryBuilderWithFilters(
            {
                ...filter,
                rootEntityName: entityName,
                rootId: root.id,
            },
            paginationArgs,
        );

        const results: BaseDependencyInterface[] = await qb;
        const ret: Dependency[] = [];

        for (const result of results) {
            const repository = this.entityManager.getRepository(result.targetEntityName);
            const instance = await repository.findOne({ [result.targetPrimaryKey]: result.targetId });

            let dependency: Dependency = result;
            if (instance) {
                const entityInfo = await this.entityInfoService.getEntityInfo(instance);
                dependency = { ...dependency, ...entityInfo };
            }
            ret.push(dependency);
        }

        const countResult: Array<{ count: string | number }> = await this.withCount(qb).select("rootId").groupBy(["rootId", "rootEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(ret, Number(totalCount));
    }

    private getQueryBuilderWithFilters(
        filter: DependentFilter &
            DependencyFilter & {
                targetEntityName?: string;
                rootEntityName?: string;
            },
        paginationArgs?: { offset: number; limit: number },
    ) {
        const qb = this.entityManager.getKnex("read").select("*").from({ idx: "block_index_dependencies" });

        if (paginationArgs?.offset !== undefined && paginationArgs?.limit !== undefined) {
            qb.offset(paginationArgs.offset).limit(paginationArgs.limit);
        }

        if (filter.targetEntityName) {
            qb.andWhere({ targetEntityName: filter.targetEntityName });
        }
        if (filter?.targetGraphqlObjectType) {
            qb.andWhere({ targetGraphqlObjectType: filter.targetGraphqlObjectType });
        }
        if (filter.targetId) {
            qb.andWhere({ targetId: filter.targetId });
        }

        if (filter.rootEntityName) {
            qb.andWhere({ rootEntityName: filter.rootEntityName });
        }
        if (filter.rootGraphqlObjectType) {
            qb.andWhere({ rootGraphqlObjectType: filter.rootGraphqlObjectType });
        }
        if (filter.rootId) {
            qb.andWhere({ rootId: filter.rootId });
        }

        if (filter?.rootColumnName) {
            qb.andWhere({ rootColumnName: filter.rootColumnName });
        }

        return qb;
    }

    private withCount(qb: Knex.QueryBuilder) {
        return qb.offset(0).clearSelect().count();
    }
}
