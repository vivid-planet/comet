import { Block, BlockData, FlatBlocks } from "@comet/cms-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import { v5 } from "uuid";

import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

interface RootBlockEntityData {
    tableName: string;
    className: string;
    rootBlockData: Array<{ block: Block; column: string }>;
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
        @InjectRepository(Warning) private readonly warningsRepository: EntityRepository<Warning>,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        const startDate = new Date();

        // TODO: (in the next PRs) Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)
        for (const data of this.groupRootBlockDataByEntity()) {
            const { tableName, className, rootBlockData } = data;

            const queryBuilderLimit = 100;
            const baseQueryBuilder = this.entityManager.createQueryBuilder(className);
            baseQueryBuilder
                .select(["id", ...rootBlockData.map(({ column }) => column)])
                .from(tableName)
                .limit(queryBuilderLimit);
            let rootBlocks: Array<{ [key: string]: BlockData }> = [];
            let offset = 0;

            do {
                const queryBuilder = baseQueryBuilder.clone();
                queryBuilder.offset(offset);
                rootBlocks = (await queryBuilder.getResult()) as Array<{ [key: string]: BlockData }>;

                for (const { column, block } of rootBlockData) {
                    for (const rootBlock of rootBlocks) {
                        const blockData = rootBlock[column];

                        const flatBlocks = new FlatBlocks(blockData, {
                            name: block.name,
                            visible: true,
                            rootPath: "root",
                        });
                        for (const node of flatBlocks.depthFirst()) {
                            const warnings = node.block.warnings();

                            if (warnings.length > 0) {
                                for (const warning of warnings) {
                                    const type = "Block";
                                    const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
                                    const id = v5(`${tableName}${rootBlock["id"]};${warning.message}`, staticNamespace);
                                    // TODO: (in the next PRs) add blockInfos/metadata

                                    await this.entityManager.upsert(
                                        Warning,
                                        {
                                            createdAt: new Date(),
                                            updatedAt: new Date(),
                                            id,
                                            type,
                                            message: warning.message,
                                            severity: WarningSeverity[warning.severity],
                                        },
                                        { onConflictExcludeFields: ["createdAt"] },
                                    );
                                }
                            }
                        }
                    }
                }

                offset += queryBuilderLimit;
            } while (rootBlocks.length > 0);
        }
        await this.entityManager.flush();

        // remove all Block-Warnings that are not present anymore
        await this.entityManager.nativeDelete(Warning, { type: "Block", updatedAt: { $lt: startDate } });
    }

    // Group root block data by tableName and className to reduce database calls.
    // This allows the query builder to efficiently load all root blocks of an entity in one database call
    private groupRootBlockDataByEntity() {
        const rootBlockEntityData = new Map<string, RootBlockEntityData>();

        for (const {
            metadata: { tableName, className },
            block,
            column,
        } of this.discoverService.discoverRootBlocks()) {
            const key = `${tableName}:${className}`;

            if (!rootBlockEntityData.has(key)) {
                rootBlockEntityData.set(key, {
                    tableName,
                    className,
                    rootBlockData: [],
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
