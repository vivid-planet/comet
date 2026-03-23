import { AnyEntity, Connection, EntityManager, type FindOptions, type ObjectQuery, QueryOrder } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { subMinutes } from "date-fns";
import { v4 as uuid } from "uuid";

import { filtersToMikroOrmQuery, gqlSortToMikroOrmOrderBy } from "../common/filter/mikro-orm";
import { StringFilter } from "../common/filter/string.filter";
import { EntityInfoService } from "../entity-info/entity-info.service";
import { DiscoverService } from "./discover.service";
import { DependencyFilter, DependentFilter } from "./dto/dependencies.filter";
import { Dependency } from "./dto/dependency";
import { DependencySort } from "./dto/dependency-sort";
import { PaginatedDependencies } from "./dto/paginated-dependencies";
import { BlockIndexDependencyObject } from "./entities/block-index-dependency.object";
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
        const refresh = async (options?: { concurrently: boolean }) => {
            const id = uuid();
            // Before forking the entity manager, race conditions occurred frequently
            // when executing the refresh asynchronous
            const forkedEntityManager = this.entityManager.fork();
            console.time(`refresh materialized block dependency ${id}`);
            const blockIndexRefresh = this.entityManager.create(BlockIndexRefresh, { startedAt: new Date() });
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
            await this.entityManager.qb(BlockIndexRefresh).truncate();
            await refresh();
            return;
        }

        const refreshIsActive = activeRefreshes.length > 0;
        if (refreshIsActive) {
            // refresh in progress -> don't refresh
            return;
        }

        const lastRefreshes = await this.entityManager.find(
            BlockIndexRefresh,
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
            await this.entityManager.qb(BlockIndexRefresh).truncate();
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
        if (rootEntityName) where.rootEntityName = rootEntityName;

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
        if (targetEntityName) where.targetEntityName = targetEntityName;

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
            if (value === undefined) continue;

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
