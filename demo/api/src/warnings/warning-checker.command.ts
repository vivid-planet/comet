import { Block, BlockData, ContentScope, FlatBlocks, ScopedEntityMeta } from "@comet/cms-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { Page } from "@src/documents/pages/entities/page.entity";
import { Command, CommandRunner } from "nest-commander";
import { v5 } from "uuid";

import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

interface RootBlockEntityData {
    tableName: string;
    className: string;
    hasScope: boolean;
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

            const selectFields = ["id", ...rootBlockData.map(({ column }) => column)];
            if (hasScope) {
                selectFields.push("scope");
            }

            baseQueryBuilder.select(selectFields).from(tableName).limit(queryBuilderLimit);
            let rootBlocks: Array<{ [key: string]: BlockData }> = [];
            let offset = 0;

            do {
                const queryBuilder = baseQueryBuilder.clone();
                queryBuilder.offset(offset);
                rootBlocks = (await queryBuilder.getResult()) as Array<{ [key: string]: BlockData }>;

                for (const { column, block } of rootBlockData) {
                    for (const rootBlock of rootBlocks) {
                        let scope: ContentScope | undefined = hasScope ? (rootBlock["scope"] as unknown as ContentScope) : undefined;
                        const blockData = rootBlock[column];

                        if (!scope) {
                            // TODO: handle error, PageTreeNode not found for document with id: 7f926a5f-e7be-4b51-81cb-9b99299efff3 which is in PageTreeNodeDocumentEntityScopeService
                            try {
                                const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [Page]);
                                const service = this.moduleRef.get(scoped, { strict: false });
                                const scopedEntityScope = await service.getEntityScope(rootBlock);

                                if (Array.isArray(scopedEntityScope)) {
                                    scope = scopedEntityScope[0]; // Check when this happens and what to do with it
                                } else {
                                    scope = scopedEntityScope;
                                }
                            } catch (e) {
                                console.log(e);
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
                                            scope,
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
            metadata: { tableName, className, definedProperties },
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
