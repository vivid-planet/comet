import { AnyEntity, Connection, QueryOrder } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, Knex } from "@mikro-orm/postgresql";
import { Injectable, Logger, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef } from "@nestjs/core";
import { subMinutes } from "date-fns";
import { v4 } from "uuid";

import { EntityInfoGetter, EntityInfoServiceInterface } from "./decorators/entity-info.decorator";
import { DiscoverService } from "./discover.service";
import { BaseDependencyInterface } from "./dto/base-dependency.interface";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { Dependency } from "./dto/dependency";
import { PaginatedDependencies } from "./dto/paginated-dependencies";
import { BlockIndexRefresh } from "./entities/block-index-refresh.entity";

interface PGStatActivity {
    pid: number;
    state: string;
    query: string;
}

@Injectable()
export class DependenciesService {
    private connection: Connection;
    private readonly logger = new Logger(DependenciesService.name);

    constructor(
        @InjectRepository(BlockIndexRefresh) private readonly refreshRepository: EntityRepository<BlockIndexRefresh>,
        private readonly discoverService: DiscoverService,
        private entityManager: EntityManager,
        private readonly moduleRef: ModuleRef,
    ) {
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

    async refreshViews(options?: { force?: boolean; awaitRefresh?: boolean }): Promise<void> {
        const refresh = async (options?: { concurrently: boolean }) => {
            const uuid = v4();
            // Before forking the entity manager, race conditions occurred frequently
            // when executing the refresh asynchronous
            const forkedEntityManager = this.entityManager.fork();
            console.time(`refresh materialized block dependency ${uuid}`);
            const blockIndexRefresh = this.refreshRepository.create({ startedAt: new Date() });
            await forkedEntityManager.persistAndFlush(blockIndexRefresh);

            await forkedEntityManager.execute(`REFRESH MATERIALIZED VIEW ${options?.concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`);

            await forkedEntityManager.persistAndFlush(Object.assign(blockIndexRefresh, { finishedAt: subMinutes(new Date(), 5) }));
            console.timeEnd(`refresh materialized block dependency ${uuid}`);
        };

        const abortActiveRefreshes = async (activeRefreshes: PGStatActivity[]) => {
            for (const refresh of activeRefreshes) {
                await this.entityManager.getKnex("write").raw(`SELECT pg_cancel_backend(?);`, [refresh.pid]);
            }
        };

        const activeRefreshes: PGStatActivity[] = await this.entityManager
            .getKnex("read")
            .select("pid", "state", "query")
            .from("pg_stat_activity")
            .where({
                state: "active",
            })
            .andWhereILike("query", "REFRESH MATERIALIZED VIEW%")
            .andWhereILike("query", "%block_index_dependencies%");

        if (options?.force) {
            // force refresh -> refresh sync
            await abortActiveRefreshes(activeRefreshes);
            await this.refreshRepository.qb().truncate();
            await refresh();
            return;
        }

        const refreshIsActive = activeRefreshes.length > 0;
        if (refreshIsActive) {
            // refresh in progress -> don't refresh
            return;
        }

        const lastRefreshes = await this.refreshRepository.find(
            {},
            { orderBy: [{ finishedAt: QueryOrder.DESC_NULLS_FIRST }, { startedAt: QueryOrder.DESC }], limit: 1 },
        );
        const lastRefresh = lastRefreshes[0];

        if (lastRefreshes.length === 0) {
            // first refresh -> refresh sync
            await refresh();
            return;
        }

        if (!refreshIsActive && lastRefresh.finishedAt === null) {
            // faulty DB state -> truncate table
            await this.refreshRepository.qb().truncate();
        }

        if (lastRefresh.finishedAt && lastRefresh.finishedAt > subMinutes(new Date(), 5)) {
            // newer than 5 minutes -> don't refresh
            return;
        } else if (lastRefresh.finishedAt && lastRefresh.finishedAt > subMinutes(new Date(), 15)) {
            // newer than 15 minutes -> refresh async
            const refreshPromise = refresh({ concurrently: true });
            if (options?.awaitRefresh) {
                // needed if refresh is executed as a console command
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
                const entityInfo = await this.getEntityInfo(instance);
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
                const entityInfo = await this.getEntityInfo(instance);
                dependency = { ...dependency, ...entityInfo };
            }
            ret.push(dependency);
        }

        const countResult: Array<{ count: string | number }> = await this.withCount(qb).select("rootId").groupBy(["rootId", "rootEntityName"]);
        const totalCount = countResult[0]?.count ?? 0;

        return new PaginatedDependencies(ret, Number(totalCount));
    }

    private async getEntityInfo(instance: object) {
        const entityInfoGetter: EntityInfoGetter | undefined = Reflect.getMetadata(`data:entityInfo`, instance.constructor);

        if (entityInfoGetter === undefined) {
            this.logger.warn(
                `Warning: ${instance.constructor.name} doesn't provide any entity info. You should add a @EntityInfo() decorator to the class. Otherwise it won't be displayed correctly as a dependency.`,
            );
            return {};
        }

        if (this.isService(entityInfoGetter)) {
            const service = this.moduleRef.get(entityInfoGetter, { strict: false });
            const { name, secondaryInformation } = await service.getEntityInfo(instance);
            return { name, secondaryInformation };
        } else {
            const { name, secondaryInformation } = await entityInfoGetter(instance);
            return { name, secondaryInformation };
        }
    }

    private isService(entityInfoGetter: EntityInfoGetter): entityInfoGetter is Type<EntityInfoServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, entityInfoGetter);
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
