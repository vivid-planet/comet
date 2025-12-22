import { InjectRepository } from "@mikro-orm/nestjs";
import { AnyEntity, Connection, EntityManager, EntityRepository, Knex, QueryOrder } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { subMinutes } from "date-fns";
import { v4 as uuid } from "uuid";

import { ENTITY_INFO_METADATA_KEY, EntityInfo } from "../common/entityInfo/entity-info.decorator";
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
    ) {
        this.connection = entityManager.getConnection();
    }

    async createViews(): Promise<void> {
        await this.createDependenciesView();
        await this.createBlockIndexView();
        await this.createEntityInfoView();
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

    async createEntityInfoView(): Promise<void> {
        const indexSelects: string[] = [];
        const targetEntities = this.discoverService.discoverTargetEntities();
        for (const targetEntity of targetEntities) {
            const entityInfo = Reflect.getMetadata(ENTITY_INFO_METADATA_KEY, targetEntity.entity) as EntityInfo<AnyEntity>;
            if (entityInfo) {
                if (typeof entityInfo === "string") {
                    indexSelects.push(entityInfo);
                } else {
                    const { entityName, metadata } = targetEntity;
                    const primary = metadata.primaryKeys[0];

                    let secondaryInformationSql = "null";
                    if (entityInfo.secondaryInformation) {
                        secondaryInformationSql = entityInfo.secondaryInformation;
                    }

                    let visibleSql = "true";
                    if (entityInfo.visible) {
                        const qb = this.entityManager.createQueryBuilder(targetEntity.entity.name, "t");
                        const query = qb.select("*").where(entityInfo.visible);
                        const sql = query.getFormattedQuery();
                        const sqlWhereMatch = sql.match(/^select .*? from .*? where (.*)/);
                        if (!sqlWhereMatch) {
                            throw new Error(`Could not extract where clause from query: ${sql}`);
                        }
                        visibleSql = sqlWhereMatch[1];
                    }

                    const select = `SELECT
                                "${entityInfo.name}" "name",
                                ${secondaryInformationSql} "secondaryInformation",
                                ${visibleSql} AS "visible",
                                t."${primary}"::text "id",
                                '${entityName}' "entityName"
                            FROM "${metadata.tableName}" t`;
                    indexSelects.push(select);
                }
            }
        }

        // add all PageTreeNode Documents (Page, Link etc) thru PageTreeNodeDocument (no @EntityInfo needed on Page/Link)
        indexSelects.push(`SELECT "PageTreeNodeEntityInfo"."name", "PageTreeNodeEntityInfo"."secondaryInformation", "PageTreeNodeEntityInfo"."visible", "PageTreeNodeDocument"."documentId"::text "id", "type" "entityName"
            FROM "PageTreeNodeDocument"
            JOIN "PageTreeNodeEntityInfo" ON "PageTreeNodeEntityInfo"."id" = "PageTreeNodeDocument"."pageTreeNodeId"::text
        `);

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating EntityInfo view");
        await this.connection.execute(`DROP VIEW IF EXISTS "EntityInfo"`);
        await this.connection.execute(`CREATE VIEW "EntityInfo" AS ${viewSql}`);
        console.timeEnd("creating EntityInfo view");
    }

    async refreshViews(options?: { force?: boolean; awaitRefresh?: boolean }): Promise<void> {
        const refresh = async (options?: { concurrently: boolean }) => {
            const id = uuid();
            // Before forking the entity manager, race conditions occurred frequently
            // when executing the refresh asynchronous
            const forkedEntityManager = this.entityManager.fork();
            console.time(`refresh materialized block dependency ${id}`);
            const blockIndexRefresh = this.refreshRepository.create({ startedAt: new Date() });
            await forkedEntityManager.persistAndFlush(blockIndexRefresh);

            await forkedEntityManager.execute(`REFRESH MATERIALIZED VIEW ${options?.concurrently ? "CONCURRENTLY" : ""} block_index_dependencies`);

            await forkedEntityManager.persistAndFlush(Object.assign(blockIndexRefresh, { finishedAt: new Date() }));
            console.timeEnd(`refresh materialized block dependency ${id}`);
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
            // const repository = this.entityManager.getRepository(result.rootEntityName);
            // const instance = await repository.findOne({ [result.rootPrimaryKey]: result.rootId });

            const dependency: Dependency = result;
            // if (instance) {
            //     const entityInfo = await this.entityInfoService.getEntityInfo(instance);
            //     dependency = { ...dependency, ...entityInfo };
            // }
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
            // const repository = this.entityManager.getRepository(result.targetEntityName);
            // const instance = await repository.findOne({ [result.targetPrimaryKey]: result.targetId });

            const dependency: Dependency = result;
            // if (instance) {
            //     const entityInfo = await this.entityInfoService.getEntityInfo(instance);
            //     dependency = { ...dependency, ...entityInfo };
            // }
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
