import { AnyEntity, Connection, EntityManager, type FindOptions, type ObjectQuery } from "@mikro-orm/postgresql";
import { Injectable, Logger, Optional } from "@nestjs/common";
import { subMinutes } from "date-fns";
import { v4 as uuid } from "uuid";

import { filtersToMikroOrmQuery, gqlSortToMikroOrmOrderBy } from "../common/filter/mikro-orm";
import { StringFilter } from "../common/filter/string.filter";
import { EntityInfoService } from "../entity-info/entity-info.service";
import { FullTextSearchService } from "../full-text-search/full-text-search.service";
import { PageTreeFullTextService } from "../page-tree/fullText/page-tree-full-text.service";
import { DiscoverService } from "./discover.service";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { Dependency } from "./dto/dependency";
import { DependencySort } from "./dto/dependency-sort";
import { PaginatedDependencies } from "./dto/paginated-dependencies";
import { BlockIndexDependencyObject } from "./entities/block-index-dependency.object";
import { FRESH_THRESHOLD_IN_MINUTES, getBlockIndexRefreshStrategy } from "./get-block-index-refresh-strategy";

interface PGStatActivity {
    pid: number;
    state: string;
    query: string;
}

// An in-progress refresh (a BlockIndexRefresh row with finishedAt = null) whose startedAt is older
// than this is considered abandoned (e.g. the process crashed before it could finish). It no longer
// blocks new refreshes from starting. Advisory locks used to auto-release on connection loss, so
// this timeout replicates that crash resilience for the lock-free coordination. It also bounds how
// long a caller waits for another caller's in-progress refresh (see refreshViews).
const ABANDONED_REFRESH_TIMEOUT_IN_MINUTES = 15;

// How often a caller polls the BlockIndexRefresh tracking table while waiting for another caller's
// in-progress refresh to finish. Between polls no database connection is held.
const REFRESH_POLL_INTERVAL_IN_MS = 500;

@Injectable()
export class DependenciesService {
    private connection: Connection;
    private readonly logger = new Logger(DependenciesService.name);
    // In-flight refresh shared by all parallel refreshViews() calls in this pod (e.g. one per DAM
    // "Usages" row). Ensures a single claim + single poll loop per pod instead of one per call.
    private runningRefresh?: Promise<void>;

    constructor(
        private readonly discoverService: DiscoverService,
        private readonly entityInfoService: EntityInfoService,
        private entityManager: EntityManager,
        @Optional() private readonly pageTreeFullTextService?: PageTreeFullTextService,
        @Optional() private readonly fullTextSearchService?: FullTextSearchService,
    ) {
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        await this.dropViews();

        await this.createBlockIndexView();
        await this.pageTreeFullTextService?.createPageTreeFullTextView();
        await this.entityInfoService.createEntityInfoView();
        await this.fullTextSearchService?.createEntityInfoFullTextView();
        await this.createDependenciesView();
    }

    async dropViews(): Promise<void> {
        await this.connection.execute(`DROP MATERIALIZED VIEW IF EXISTS "block_index_dependencies"`);
        await this.connection.execute(`DROP VIEW IF EXISTS "block_index"`);
        await this.fullTextSearchService?.dropEntityInfoFullTextView();
        await this.entityInfoService.dropEntityInfoView();
        await this.pageTreeFullTextService?.dropPageTreeFullTextView();
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
                            COALESCE(ei_root."visible", true)                                   "entityVisible",
                            ((indexObj->>'visible')::boolean AND COALESCE(ei_root."visible", true))  "visible",
                            targetTableData->>'entityName'                                      "targetEntityName",
                            targetTableData->>'graphqlObjectType'                               "targetGraphqlObjectType",
                            targetTableData->>'tableName'                                       "targetTableName",
                            targetTableData->>'primary'                                         "targetPrimaryKey",
                            dependenciesObj->>'id'                                              "targetId",
                            ei_root."name"                                                      "rootName",
                            ei_root."secondaryInformation"                                      "rootSecondaryInformation",
                            ei_target."name"                                                    "targetName",
                            ei_target."secondaryInformation"                                    "targetSecondaryInformation"
                        FROM "${metadata.tableName}"
                        CROSS JOIN LATERAL json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj
                        CROSS JOIN LATERAL json_array_elements(indexObj->'dependencies') dependenciesObj
                        CROSS JOIN LATERAL json_extract_path('${JSON.stringify(targetEntitiesNameData)}', dependenciesObj->>'targetEntityName') targetTableData
                        LEFT JOIN "EntityInfo" as ei_root ON ei_root."id" = "${metadata.tableName}"."${primary}"::text
                            AND ei_root."entityName" = '${metadata.name}'
                        LEFT JOIN "EntityInfo" as ei_target ON ei_target."id" = dependenciesObj->>'id'
                            AND ei_target."entityName" = dependenciesObj->>'targetEntityName'`;

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
     * A `REFRESH MATERIALIZED VIEW` is expensive and can take many seconds, so the goal is to never
     * run more than one at a time. `refreshViews` runs once per resolved `dependents`/`dependencies`
     * field, so the DAM "Usages" column starts many parallel calls in one API process, and multiple
     * pods can start a refresh at the same moment. Concurrent refreshes are prevented on two levels,
     * both lock-free (no PostgreSQL advisory locks):
     *
     * 1. **One shared refresh per pod.** Parallel calls share a single in-flight `runningRefresh`, so
     *    only one claim and (at most) one poll loop runs per pod instead of one per call.
     * 2. **One refresh per database.** The `BlockIndexRefresh` table has a partial unique index
     *    permitting only one in-progress row, so across all pods exactly one caller wins the claim
     *    (the rest hit `ON CONFLICT DO NOTHING`) and runs a single `REFRESH MATERIALIZED VIEW`.
     *
     * The refresh strategy depends on the age of the last completed refresh:
     * - Fresh (< 5 minutes): Skip refresh
     * - Moderately stale (5–15 minutes): Concurrent background refresh (caller does not wait)
     * - Very stale (> 15 minutes): Synchronous refresh (caller waits for fresh data)
     * - No prior refresh: Synchronous refresh (initialization, caller waits)
     *
     * For the synchronous strategies, a caller that does not win the claim (another pod is already
     * refreshing) polls the tracking table until that refresh finishes and then returns, so it still
     * observes fresh data. Polling holds no database connection between polls. The concurrent
     * (background) strategy never waits.
     *
     * @param options - Configuration options for the refresh operation
     * @param options.force - If true, cancels any running refresh and performs a full synchronous refresh
     * @param options.awaitRefresh - If true, waits for background concurrent refreshes to complete. Intended to be used by CLI commands.
     *
     * @returns A promise that resolves when the refresh completes (or immediately if skipped or backgrounded)
     */
    async refreshViews(options?: { force?: boolean; awaitRefresh?: boolean }): Promise<void> {
        if (options?.force) {
            await this.forceRefresh();
            return;
        }

        const lastRefresh = await this.getLastFinishedRefresh();
        const strategy = getBlockIndexRefreshStrategy({
            lastFinishedAt: lastRefresh ? new Date(lastRefresh.finishedAt) : null,
            now: new Date(),
        });

        if (strategy === "skip") {
            return;
        }

        // Deduplicate parallel refreshes within this pod: share a single in-flight refresh so they
        // don't each claim, poll, or open a connection.
        if (!this.runningRefresh) {
            const runningRefresh = this.refresh({ concurrently: strategy === "concurrent" }).finally(() => {
                this.runningRefresh = undefined;
            });
            this.runningRefresh = runningRefresh;
            // A backgrounded refresh has no awaiter — log failures instead of leaving an unhandled rejection.
            runningRefresh.catch((error) => {
                this.logger.error(`Block index refresh failed: ${error instanceof Error ? error.message : error}`);
            });
        }

        // Wait when synchronous (very stale / uninitialized) or when explicitly requested (CLI awaitRefresh).
        // The moderately-stale strategy refreshes in the background without blocking the caller.
        if (strategy === "synchronous" || options?.awaitRefresh) {
            await this.runningRefresh;
        }
    }

    private async refresh({ concurrently = false } = {}): Promise<void> {
        // A background (concurrent) refresh never blocks the caller; a synchronous refresh must return
        // fresh data, so it waits for another pod's in-progress refresh instead of skipping.
        const waitForRunningRefresh = !concurrently;
        while (true) {
            const claimedId = await this.tryClaimRefresh();
            if (claimedId) {
                await this.runRefresh({ id: claimedId, concurrently });
                return;
            }

            if (!waitForRunningRefresh) {
                // Background mode: another pod is refreshing or one completed recently. Don't block.
                return;
            }

            // Synchronous mode: the caller needs fresh data. If a refresh is running (on another pod),
            // wait for it to finish, then re-evaluate. If nothing is running, the claim failed because
            // a recent refresh already made the data fresh, so we're done.
            const didWait = await this.waitForRunningRefreshToComplete();
            if (!didWait) {
                return;
            }
            // The refresh we waited for either produced fresh data (next claim skips on recency and
            // returns) or failed and left no fresh row (next claim succeeds and we refresh).
        }
    }

    // Atomically claim the refresh across all pods. The partial unique index
    // "BlockIndexRefresh_single_running" allows only one in-progress row (finishedAt = null), so when
    // several callers race, exactly one INSERT succeeds and the rest hit ON CONFLICT DO NOTHING. The
    // recency guard additionally skips when a refresh completed within the fresh threshold. Returns
    // the new row's id if this caller claimed the refresh, otherwise null.
    private async tryClaimRefresh(): Promise<string | null> {
        const knex = this.entityManager.getKnex("write");

        // Remove an abandoned in-progress marker (from a crashed refresh) so it neither blocks the
        // unique index nor makes waiters poll forever. Advisory locks used to auto-release on
        // connection loss; this replicates that crash resilience.
        await knex("BlockIndexRefresh")
            .whereNull("finishedAt")
            .where("startedAt", "<=", subMinutes(new Date(), ABANDONED_REFRESH_TIMEOUT_IN_MINUTES))
            .delete();

        const id = uuid();
        const claim = await knex.raw(
            `INSERT INTO "BlockIndexRefresh" ("id", "startedAt", "finishedAt")
                SELECT ?, ?, NULL
                WHERE NOT EXISTS (
                    SELECT 1 FROM "BlockIndexRefresh" WHERE "finishedAt" > ?
                )
                ON CONFLICT DO NOTHING
                RETURNING "id"`,
            [id, new Date(), subMinutes(new Date(), FRESH_THRESHOLD_IN_MINUTES)],
        );
        return claim.rows.length > 0 ? id : null;
    }

    // The in-progress refresh (a non-abandoned row with finishedAt = null), or undefined if none.
    private async getRunningRefresh(): Promise<{ id: string } | undefined> {
        const knex = this.entityManager.getKnex("write");
        return knex("BlockIndexRefresh")
            .whereNull("finishedAt")
            .where("startedAt", ">", subMinutes(new Date(), ABANDONED_REFRESH_TIMEOUT_IN_MINUTES))
            .first();
    }

    private async runRefresh({ id, concurrently }: { id: string; concurrently: boolean }): Promise<void> {
        const knex = this.entityManager.getKnex("write");
        this.logger.log(`Starting block index refresh ${id}`);
        try {
            await knex.raw(`REFRESH MATERIALIZED VIEW ${concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`);
            await knex("BlockIndexRefresh").where({ id }).update({ finishedAt: new Date() });
        } catch (error) {
            // Remove the in-progress marker so a failed refresh doesn't block subsequent refreshes.
            await knex("BlockIndexRefresh").where({ id }).delete();
            throw error;
        }
        this.logger.log(`Completed block index refresh ${id}`);
    }

    // Poll the tracking table until the in-progress refresh finishes (or is abandoned). Returns true
    // if a refresh was running and we waited for it, false if none was running. Bounded by
    // ABANDONED_REFRESH_TIMEOUT_IN_MINUTES: once the running refresh's startedAt crosses that age,
    // getRunningRefresh no longer sees it and the loop ends.
    private async waitForRunningRefreshToComplete(): Promise<boolean> {
        let running = await this.getRunningRefresh();
        const didWait = Boolean(running);
        while (running) {
            await new Promise((resolve) => setTimeout(resolve, REFRESH_POLL_INTERVAL_IN_MS));
            running = await this.getRunningRefresh();
        }
        return didWait;
    }

    private async getLastFinishedRefresh(): Promise<{ finishedAt: Date } | undefined> {
        return this.entityManager
            .getKnex("read")
            .select("*")
            .from("BlockIndexRefresh")
            .whereNotNull("finishedAt")
            .orderBy("finishedAt", "desc")
            .first();
    }

    private async forceRefresh(): Promise<void> {
        const knex = this.entityManager.getKnex("write");

        // Cancel any currently running refresh query so we can start clean. We look up active backends
        // running the REFRESH MATERIALIZED VIEW statement and send pg_cancel_backend to each.
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

        // Clear the tracking table (dropping any in-progress markers from the cancelled refreshes),
        // then perform a full non-concurrent refresh. The non-concurrent REFRESH takes an ACCESS
        // EXCLUSIVE lock on the view, so it serialises against any refresh that slipped through.
        await knex("BlockIndexRefresh").truncate();
        await knex.raw(`REFRESH MATERIALIZED VIEW block_index_dependencies`);
        await knex("BlockIndexRefresh").insert({ id: uuid(), startedAt: new Date(), finishedAt: new Date() });
    }

    async getDependents(
        target: AnyEntity<{ id: string }> | { entityName: string; id: string },
        options?: {
            filter?: DependentFilter & { rootEntityName?: string };
            offset?: number;
            limit?: number;
            forceRefresh?: boolean;
            sort?: DependencySort[];
        },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews({ force: options?.forceRefresh });
        const { rootEntityName, ...filter } = options?.filter ?? {};

        const entityName = "entityName" in target ? target.entityName : target.constructor.name;

        const where = filtersToMikroOrmQuery(this.remapFilter(filter, "dependents")) as ObjectQuery<BlockIndexDependencyObject>;
        where.targetEntityName = entityName;
        where.targetId = target.id;
        if (rootEntityName) {
            where.rootEntityName = rootEntityName;
        }

        const findOptions: FindOptions<BlockIndexDependencyObject> = { offset: options?.offset, limit: options?.limit };
        if (options?.sort) {
            findOptions.orderBy = gqlSortToMikroOrmOrderBy(this.remapSort(options.sort, "dependents"));
        }

        const [entities, totalCount] = await this.entityManager.findAndCount(BlockIndexDependencyObject, where, findOptions);

        const results = entities.map((entity) => this.mapToResult(entity, "dependents"));
        return new PaginatedDependencies(results, totalCount);
    }

    async getDependencies(
        root: AnyEntity<{ id: string }> | { entityName: string; id: string },
        options?: {
            filter?: DependencyFilter & { targetEntityName?: string };
            offset?: number;
            limit?: number;
            forceRefresh?: boolean;
            sort?: DependencySort[];
        },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews({ force: options?.forceRefresh });
        const { targetEntityName, ...filter } = options?.filter ?? {};

        const entityName = "entityName" in root ? root.entityName : root.constructor.name;

        const where = filtersToMikroOrmQuery(this.remapFilter(filter, "dependencies")) as ObjectQuery<BlockIndexDependencyObject>;
        where.rootEntityName = entityName;
        where.rootId = root.id;
        if (targetEntityName) {
            where.targetEntityName = targetEntityName;
        }

        const findOptions: FindOptions<BlockIndexDependencyObject> = { offset: options?.offset, limit: options?.limit };
        if (options?.sort) {
            findOptions.orderBy = gqlSortToMikroOrmOrderBy(this.remapSort(options.sort, "dependencies"));
        }

        const [entities, totalCount] = await this.entityManager.findAndCount(BlockIndexDependencyObject, where, findOptions);

        const results = entities.map((entity) => this.mapToResult(entity, "dependencies"));
        return new PaginatedDependencies(results, totalCount);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private remapFilter(filter: Record<string, any>, context: "dependencies" | "dependents"): Record<string, any> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const remapped: Record<string, any> = {};

        for (const [key, value] of Object.entries(filter)) {
            if (value === undefined) {
                continue;
            }

            if (key === "and" || key === "or") {
                remapped[key] = (value as Record<string, unknown>[]).map((f) => this.remapFilter(f, context));
                continue;
            }

            const mappedKey = this.remapColumnName(key, context);

            // Convert plain string values to StringFilter so filtersToMikroOrmQuery can handle them
            if (typeof value === "string") {
                const stringFilter = new StringFilter();
                stringFilter.equal = value;
                remapped[mappedKey] = stringFilter;
            } else {
                remapped[mappedKey] = value;
            }
        }

        return remapped;
    }

    private remapColumnName(key: string, context: "dependencies" | "dependents"): string {
        const prefix = context === "dependents" ? "root" : "target";
        switch (key) {
            case "name":
                return `${prefix}Name`;
            case "secondaryInformation":
                return `${prefix}SecondaryInformation`;
            case "graphqlObjectType":
                return `${prefix}GraphqlObjectType`;
            default:
                return key;
        }
    }

    private remapSort(sort: DependencySort[], context: "dependencies" | "dependents") {
        return sort.map(({ field, direction }) => ({ field: this.remapColumnName(field, context), direction }));
    }

    private mapToResult(entity: BlockIndexDependencyObject, context: "dependencies" | "dependents"): Dependency {
        const result = new Dependency();
        Object.assign(result, entity);
        result.name = context === "dependents" ? entity.rootName : entity.targetName;
        result.secondaryInformation = context === "dependents" ? entity.rootSecondaryInformation : entity.targetSecondaryInformation;
        return result;
    }
}
