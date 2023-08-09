import { AnyEntity, Connection, QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, Knex } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import * as console from "console";
import { subMinutes } from "date-fns";

import { Dependency } from "./dependency";
import { DiscoverService } from "./discover.service";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { PaginatedDependencies } from "./dto/paginated-dependencies";
import { RefreshBlockIndex } from "./entities/refresh-block-index.entity";

@Injectable()
export class DependenciesService {
    private entityManager: EntityManager;
    private connection: Connection;

    constructor(
        @InjectRepository(RefreshBlockIndex) private readonly refreshRepository: EntityRepository<RefreshBlockIndex>,
        private readonly discoverService: DiscoverService,
        entityManager: EntityManager,
    ) {
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
        await this.connection.execute(
            `CREATE UNIQUE INDEX ON block_index_dependencies ("rootId", "rootTableName", "rootColumnName", "blockname", "jsonPath", "targetTableName", "targetId")`,
        );
        console.timeEnd("creating block dependency materialized view");

        console.time("creating block dependency materialized view index");
        await this.connection.execute(`CREATE INDEX block_index_dependencies_targetId ON block_index_dependencies ("targetId")`);
        console.timeEnd("creating block dependency materialized view index");
    }

    async refreshViews(options?: { force?: boolean; consoleCommand?: boolean }): Promise<void> {
        const refresh = async (options?: { concurrently: boolean }) => {
            console.time("refresh materialized block dependency");
            const refreshBlockIndex = this.refreshRepository.create({ startedAt: new Date() });
            await this.refreshRepository.getEntityManager().persistAndFlush(refreshBlockIndex);

            await this.connection.execute(`REFRESH MATERIALIZED VIEW ${options?.concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`);

            await this.refreshRepository.getEntityManager().persistAndFlush(Object.assign(refreshBlockIndex, { finishedAt: new Date() }));
            console.timeEnd("refresh materialized block dependency");
        };

        if (options?.force) {
            // force refresh -> refresh sync
            await this.refreshRepository.qb().truncate();
            await refresh();
            return;
        }

        const lastRefreshes = await this.refreshRepository.find({}, { orderBy: { finishedAt: QueryOrder.DESC_NULLS_FIRST }, limit: 1 });
        if (lastRefreshes.length === 0) {
            // first refresh -> refresh sync");
            await refresh();
            return;
        }

        const lastRefresh = lastRefreshes[0];
        // if the DB state indicates that a refresh takes more than 15 minutes,
        // it's likely that the previous refresh isn't actually in progress but was interrupted unexpectedly
        const isRefreshInProgress = lastRefresh.finishedAt === null && lastRefresh.startedAt > subMinutes(new Date(), 15);

        if (isRefreshInProgress) {
            // refresh in progress -> don't refresh
            return;
        } else if (lastRefresh.finishedAt && lastRefresh.finishedAt > subMinutes(new Date(), 5)) {
            // newer than 5 minutes -> don't refresh
            return;
        } else if (lastRefresh.finishedAt && lastRefresh.finishedAt > subMinutes(new Date(), 15)) {
            // newer than 15 minutes -> refresh async
            const refreshPromise = refresh({ concurrently: true });
            if (options?.consoleCommand) {
                // await if executed as a console command
                // otherwise the command exits and the refresh method is interrupted
                await refreshPromise;
            }
        } else {
            // older than 15 minutes / faulty previous refresh -> refresh sync
            await refresh();
        }
    }

    async getDependents(
        target: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: DependentFilter & {
            rootEntityName?: string;
        },
        paginationArgs?: { offset: number; limit: number },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews();

        const entityName = "entityName" in target ? target.entityName : target.constructor.name;

        const qb = this.getQueryBuilderWithFilters(
            {
                ...filter,
                targetEntityName: entityName,
                targetId: target.id,
            },
            paginationArgs,
        );

        const results: Dependency[] = await qb;

        const countResult = await this.withCount(qb).select("rootId").groupBy(["rootId", "rootEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(results, Number(totalCount));
    }

    async getDependencies(
        root: AnyEntity<{ id: string }> | { entityName: string; id: string },
        filter?: DependencyFilter & {
            targetEntityName?: string;
        },
        paginationArgs?: { offset: number; limit: number },
    ): Promise<PaginatedDependencies> {
        await this.refreshViews();

        const entityName = "entityName" in root ? root.entityName : root.constructor.name;

        const qb = this.getQueryBuilderWithFilters(
            {
                ...filter,
                rootEntityName: entityName,
                rootId: root.id,
            },
            paginationArgs,
        );

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
