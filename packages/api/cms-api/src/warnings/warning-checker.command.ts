import { CreateRequestContext, EntityClass, MikroORM } from "@mikro-orm/core";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef, Reflector } from "@nestjs/core";
import { Command, CommandRunner } from "nest-commander";
import { Block, BlockData } from "src/blocks/block";

import { FlatBlocks } from "../blocks/flat-blocks/flat-blocks";
import { DiscoverService } from "../dependencies/discover.service";
import { CreateWarningsFunction, CreateWarningsMeta, CreateWarningsServiceInterface } from "./decorators/create-warnings.decorator";
import { Warning } from "./entities/warning.entity";
import { WarningService } from "./warning.service";

interface RootBlockEntityData {
    primaryKey: string;
    tableName: string;
    className: string;
    rootBlockData: Array<{ block: Block; column: string }>;
}

interface RootBlockData {
    id: string;
    [key: string]: BlockData | string;
}

@Injectable()
@Command({
    name: "check-warnings",
    description: "Checks for warnings",
})
export class WarningCheckerCommand extends CommandRunner {
    constructor(
        private readonly orm: MikroORM,
        private readonly discoverService: DiscoverService,
        private readonly entityManager: EntityManager,
        private readonly warningService: WarningService,
        private reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        let startDate = new Date();

        // TODO: (in the next PRs) Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)
        for (const data of this.groupRootBlockDataByEntity()) {
            const { tableName, className, rootBlockData } = data;

            const queryBuilderLimit = 100;
            const baseQueryBuilder = this.entityManager.createQueryBuilder(className);
            baseQueryBuilder
                .select([`${data.primaryKey} as id`, ...rootBlockData.map(({ column }) => column)])
                .from(tableName)
                .limit(queryBuilderLimit);
            let rootBlocks: RootBlockData[] = [];
            let offset = 0;

            do {
                const queryBuilder = baseQueryBuilder.clone();
                queryBuilder.offset(offset);
                rootBlocks = (await queryBuilder.getResult()) as RootBlockData[];
                for (const { column, block } of rootBlockData) {
                    for (const rootBlock of rootBlocks) {
                        const blockData = rootBlock[column] as BlockData;

                        const flatBlocks = new FlatBlocks(blockData, {
                            name: block.name,
                            visible: true,
                            rootPath: "root",
                        });
                        for (const node of flatBlocks.depthFirst()) {
                            await this.warningService.saveWarnings({
                                warnings: node.block.warnings(),
                                type: "Block",
                                sourceInfo: {
                                    rootEntityName: tableName,
                                    rootColumnName: column,
                                    rootPrimaryKey: data.primaryKey,
                                    targetId: rootBlock.id,
                                    jsonPath: node.pathToString(),
                                },
                            });
                        }
                    }
                }

                offset += queryBuilderLimit;
            } while (rootBlocks.length > 0);
        }
        await this.entityManager.flush();

        // remove all Block-Warnings that are not present anymore
        await this.entityManager.nativeDelete(Warning, { type: "Block", updatedAt: { $lt: startDate } });

        startDate = new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entities = this.orm.config.get("entities") as EntityClass<any>[];
        const metadataStorage = this.orm.em.getMetadata();

        for (const entity of entities) {
            const entityMetadata = metadataStorage.get(entity.name);
            const createWarnings = this.reflector.getAllAndOverride<CreateWarningsMeta>("createWarnings", [entity]);
            if (createWarnings) {
                const repository = this.entityManager.getRepository(entity);

                if (this.isService(createWarnings)) {
                    const service = this.moduleRef.get(createWarnings, { strict: false });

                    if (service.bulkCreateWarnings) {
                        const warningGenerator = service.bulkCreateWarnings();
                        for await (const { warnings, targetId } of warningGenerator) {
                            for (const warning of warnings) {
                                await this.warningService.saveWarnings({
                                    warnings: await service.createWarnings(warning),
                                    type: "Entity",
                                    sourceInfo: {
                                        rootEntityName: entity.name,
                                        rootPrimaryKey: entityMetadata.primaryKeys[0],
                                        targetId,
                                    },
                                });
                            }
                        }
                    } else {
                        await this.processEntityWarningsIndividually({
                            repository,
                            createWarnings: (entity) => service.createWarnings(entity),
                            rootEntityName: entity.name,
                            rootPrimaryKey: entityMetadata.primaryKeys[0],
                        });
                    }
                } else {
                    await this.processEntityWarningsIndividually({
                        repository,
                        createWarnings,
                        rootEntityName: entity.name,
                        rootPrimaryKey: entityMetadata.primaryKeys[0],
                    });
                }
            }
        }

        // remove all Entity-Warnings that are not present anymore
        await this.entityManager.nativeDelete(Warning, { type: "Entity", updatedAt: { $lt: startDate } });
    }

    private async processEntityWarningsIndividually({
        repository,
        createWarnings,
        rootEntityName,
        rootPrimaryKey,
    }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repository: EntityRepository<any>;
        createWarnings: CreateWarningsFunction;
        rootEntityName: string;
        rootPrimaryKey: string;
    }) {
        let rows = [];
        const limit = 50;
        let offset = 0;
        do {
            rows = await repository.find({}, { limit, offset });
            offset += limit;

            for (const row of rows) {
                await this.warningService.saveWarnings({
                    warnings: await createWarnings(row),
                    type: "Entity",
                    sourceInfo: {
                        rootEntityName,
                        rootPrimaryKey,
                        targetId: row[rootPrimaryKey],
                    },
                });
            }
        } while (rows.length > 0);
    }

    private isService(meta: CreateWarningsMeta): meta is Type<CreateWarningsServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, meta);
    }

    // Group root block data by tableName and className to reduce database calls.
    // This allows the query builder to efficiently load all root blocks of an entity in one database call
    private groupRootBlockDataByEntity() {
        const rootBlockEntityData = new Map<string, RootBlockEntityData>();

        for (const {
            metadata: { tableName, className, primaryKeys },
            block,
            column,
        } of this.discoverService.discoverRootBlocks()) {
            const key = `${tableName}:${className}`;

            if (!rootBlockEntityData.has(key)) {
                rootBlockEntityData.set(key, {
                    tableName,
                    className,
                    rootBlockData: [],
                    primaryKey: primaryKeys[0],
                });
            }

            const discoveredData = rootBlockEntityData.get(key);
            if (discoveredData) {
                discoveredData.rootBlockData.push({ block, column });
            }
        }

        return rootBlockEntityData.values();
    }
}
