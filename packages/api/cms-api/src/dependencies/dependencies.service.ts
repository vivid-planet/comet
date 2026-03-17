import { AnyEntity, Connection, EntityManager, Knex } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { subMinutes } from "date-fns";
import { v4 as uuid } from "uuid";

import { EntityInfoService } from "../entity-info/entity-info.service";
import { DiscoverService } from "./discover.service";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { Dependency } from "./dto/dependency";
import { PaginatedDependencies } from "./dto/paginated-dependencies";

interface PGStatActivity {
    pid: number;
    state: string;
    query: string;
}

// Advisory lock key for block_index_dependencies refresh deduplication.
const BLOCK_INDEX_REFRESH_LOCK_KEY = 4201;

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
        await this.dropViews();

        await this.createBlockIndexView();
        await this.entityInfoService.createEntityInfoView();
        await this.createDependenciesView();
    }

    async dropViews(): Promise<void> {
        await this.connection.execute(`DROP MATERIALIZED VIEW IF EXISTS "block_index_dependencies"`);
        await this.connection.execute(`DROP VIEW IF EXISTS "block_index"`);
        await this.entityInfoService.dropEntityInfoView();
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
                            "${metadata.tableName}"."${primary}"                                "rootId",
                            '${metadata.name}'                                                  "rootEntityName",
                            '${graphqlObjectType}'                                              "rootGraphqlObjectType",
                            '${metadata.tableName}'                                             "rootTableName",
                            '${column}'                                                         "rootColumnName",
                            '${primary}'                                                        "rootPrimaryKey",
                            indexObj->>'blockname'                                              "blockname",
                            indexObj->>'jsonPath'                                               "jsonPath",
                            indexObj->>'visible'                                                "blockVisible",
                            COALESCE(ei."visible", true)                                        "entityVisible",
                            ((indexObj->>'visible')::boolean AND COALESCE(ei."visible", true))  "visible",
                            targetTableData->>'entityName'                                      "targetEntityName",
                            targetTableData->>'graphqlObjectType'                               "targetGraphqlObjectType",
                            targetTableData->>'tableName'                                       "targetTableName",
                            targetTableData->>'primary'                                         "targetPrimaryKey",
                            dependenciesObj->>'id'                                              "targetId"
                        FROM "${metadata.tableName}"
                        CROSS JOIN LATERAL json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj
                        CROSS JOIN LATERAL json_array_elements(indexObj->'dependencies') dependenciesObj
                        CROSS JOIN LATERAL json_extract_path('${JSON.stringify(targetEntitiesNameData)}', dependenciesObj->>'targetEntityName') targetTableData
                        LEFT JOIN "EntityInfo" as ei ON ei."id" = "${metadata.tableName}"."${primary}"::text
                            AND ei."entityName" = '${metadata.name}'`;

            indexSelects.push(select);
        }

        if (indexSelects.length === 0) {
            this.logger.log("Skipping block_index_dependencies materialized view creation: no root block entities found");
            return;
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

        if (indexSelects.length === 0) {
            this.logger.log("Skipping block_index view creation: no root block entities found");
            return;
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating block index view");
        await this.connection.execute(`DROP VIEW IF EXISTS block_index`);
        await this.connection.execute(`CREATE VIEW block_index AS ${viewSql}`);
        console.timeEnd("creating block index view");
    }

    /**
     * Refreshes the block index materialized views with intelligent refresh strategies
     * based on data staleness and options.
     *
     * @remarks
     * This method uses PostgreSQL advisory locks to prevent duplicate concurrent refreshes.
     * The refresh strategy depends on the age of the last completed refresh:
     * - Fresh (< 5 minutes): Skip refresh
     * - Moderately stale (5–15 minutes): Concurrent background refresh
     * - Very stale (> 15 minutes): Synchronous refresh (caller waits)
     * - No prior refresh: Synchronous refresh (initialization)
     *
     * @param options - Configuration options for the refresh operation
     * @param options.force - If true, cancels any running refresh and performs a full synchronous refresh
     * @param options.awaitRefresh - If true, waits for background concurrent refreshes to complete. Intended to be used by CLI commands.
     *
     * @returns A promise that resolves when the refresh completes (or immediately if skipped or backgrounded)
     */
    async refreshViews(options?: { force?: boolean; awaitRefresh?: boolean }): Promise<void> {
        const knex = this.entityManager.getKnex("write");

        const refresh = async (refreshOptions?: { concurrently: boolean }): Promise<void> => {
            await knex.transaction(async (trx) => {
                if (refreshOptions?.concurrently) {
                    // Non-blocking lock: Try to acquire the lock. Only acquire if available.
                    const lockResult = await trx.raw(`SELECT pg_try_advisory_xact_lock(?) AS locked`, [BLOCK_INDEX_REFRESH_LOCK_KEY]);

                    if (!lockResult.rows[0]?.locked) {
                        // If another refresh already holds the lock (= a refresh is already in
                        // progress), skip this refresh entirely
                        return;
                    }
                } else {
                    // Blocking lock: Wait until the lock is available (= the currently running
                    // refresh completes). Then acquire the lock.
                    await trx.raw(`SELECT pg_advisory_xact_lock(?)`, [BLOCK_INDEX_REFRESH_LOCK_KEY]);

                    // After acquiring the lock, check if the previous holder already completed a fresh
                    // refresh. This prevents redundant work when multiple callers were blocked waiting.
                    const recentRefresh = await trx("BlockIndexRefresh").whereNotNull("finishedAt").orderBy("finishedAt", "desc").first();

                    if (recentRefresh && new Date(recentRefresh.finishedAt) > subMinutes(new Date(), 5)) {
                        // A refresh was completed within the last 5 minutes, which is fresh enough.
                        // Skip this refresh.
                        return;
                    }
                }

                const id = uuid();
                this.logger.log(`Starting block index refresh ${id}`);

                await trx("BlockIndexRefresh").insert({ id, startedAt: new Date(), finishedAt: null });

                await trx.raw(`REFRESH MATERIALIZED VIEW ${refreshOptions?.concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`);

                await trx("BlockIndexRefresh").where({ id }).update({ finishedAt: new Date() });

                this.logger.log(`Completed block index refresh ${id}`);
            });
        };

        if (options?.force) {
            // Force refresh: cancel any currently running refresh query so we can start clean.
            // We look up active backends running the REFRESH MATERIALIZED VIEW statement and
            // send pg_cancel_backend to each. After cancellation, we still need to acquire the
            // advisory lock (blocking) to wait for the cancelled query to actually release it.
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

            // Acquire the lock (waits for cancelled queries to finish rolling back), then
            // truncate the tracking table and perform a full non-concurrent refresh.
            await knex.transaction(async (trx) => {
                await trx.raw(`SELECT pg_advisory_xact_lock(?)`, [BLOCK_INDEX_REFRESH_LOCK_KEY]);
                await trx("BlockIndexRefresh").truncate();
                await trx.raw(`REFRESH MATERIALIZED VIEW block_index_dependencies`);
                await trx("BlockIndexRefresh").insert({ id: uuid(), startedAt: new Date(), finishedAt: new Date() });
            });

            return;
        }

        // Decide refresh strategy based on age of the last completed refresh
        const lastRefresh = await this.entityManager
            .getKnex("read")
            .select("*")
            .from("BlockIndexRefresh")
            .whereNotNull("finishedAt")
            .orderBy("finishedAt", "desc")
            .first();

        if (!lastRefresh) {
            // No prior refresh exists — first-time initialization, must refresh synchronously
            await refresh();
            return;
        }

        const finishedAt = new Date(lastRefresh.finishedAt);
        const now = new Date();

        if (finishedAt > subMinutes(now, 5)) {
            // Fresh enough (< 5 minutes) — skip refresh entirely
            return;
        } else if (finishedAt > subMinutes(now, 15)) {
            // Moderately stale (5–15 minutes) — refresh concurrently in the background
            const refreshPromise = refresh({ concurrently: true });
            if (options?.awaitRefresh) {
                // Caller wants to wait for the refresh to complete, even if it's concurrent. Only used by CLI command.
                await refreshPromise;
            }
        } else {
            // Very stale (> 15 minutes) — refresh synchronously, caller waits for fresh data
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
        ).join("EntityInfo", (join) => {
            join.on("idx.rootEntityName", "EntityInfo.entityName").andOn(
                "EntityInfo.id",
                this.entityManager.getKnex("read").raw('"idx"."rootId"::text'),
            );
        });

        const results: Dependency[] = await qb;

        const countResult: Array<{ count: string | number }> = await this.withCount(qb).select("targetId").groupBy(["targetId", "targetEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(results, Number(totalCount));
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
        ).join("EntityInfo", (join) => {
            join.on("idx.targetEntityName", "EntityInfo.entityName").andOn(
                "EntityInfo.id",
                this.entityManager.getKnex("read").raw('"idx"."targetId"::text'),
            );
        });

        const results: Dependency[] = await qb;

        const countResult: Array<{ count: string | number }> = await this.withCount(qb).select("rootId").groupBy(["rootId", "rootEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(results, Number(totalCount));
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
