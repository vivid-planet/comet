import { Block, BlockData, ContentScope, FlatBlocks, ScopedEntityMeta } from "@comet/cms-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { Command, CommandRunner } from "nest-commander";

import { Warning } from "./entities/warning.entity";
import { WarningService } from "./warning.service";

interface RootBlockEntityData {
    primaryKey: string;
    tableName: string;
    className: string;
    hasScope: boolean;
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
        @InjectRepository(Warning) private readonly warningsRepository: EntityRepository<Warning>,
        private readonly warningService: WarningService,
        private reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        const startDate = new Date();

        // TODO: (in the next PRs) Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)
        for (const data of this.groupRootBlockDataByEntity()) {
            const { tableName, className, rootBlockData, hasScope } = data;

            const queryBuilderLimit = 100;
            const baseQueryBuilder = this.entityManager.createQueryBuilder(className);

            const selectFields = [`${data.primaryKey} as id`, ...rootBlockData.map(({ column }) => column)];
            if (hasScope) {
                selectFields.push("scope");
            }

            baseQueryBuilder.select(selectFields).from(tableName).limit(queryBuilderLimit);
            let rootBlocks: RootBlockData[] = [];
            let offset = 0;

            do {
                const queryBuilder = baseQueryBuilder.clone();
                queryBuilder.offset(offset);
                rootBlocks = (await queryBuilder.getResult()) as RootBlockData[];

                for (const { column, block } of rootBlockData) {
                    for (const rootBlock of rootBlocks) {
                        let scope: ContentScope | undefined = hasScope ? (rootBlock["scope"] as unknown as ContentScope) : undefined;
                        const blockData = rootBlock[column] as BlockData;

                        if (!scope) {
                            const entity = this.orm.getMetadata().get(className).class;
                            const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [entity]);

                            if (scoped) {
                                const service = this.moduleRef.get(scoped, { strict: false });
                                const scopedEntityScope = await service.getEntityScope(rootBlock);
                                if (Array.isArray(scopedEntityScope)) {
                                    throw new Error("Multiple scopes are not supported for warnings");
                                } else {
                                    scope = scopedEntityScope;
                                }
                            }
                        }

                        const flatBlocks = new FlatBlocks(blockData, {
                            name: block.name,
                            visible: true,
                            rootPath: "root",
                        });
                        for (const node of flatBlocks.depthFirst()) {
                            const warnings = node.block.warnings();

                            if (warnings.length > 0) {
                                for (const warning of warnings) {
                                    this.warningService.saveWarning({
                                        warning,
                                        scope,
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
            metadata: { tableName, className, primaryKeys, definedProperties },
            block,
            column,
        } of this.discoverService.discoverRootBlocks()) {
            const key = `${tableName}:${className}`;

            if (!rootBlockEntityData.has(key)) {
                rootBlockEntityData.set(key, {
                    tableName,
                    className,
                    hasScope: "scope" in definedProperties,
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
