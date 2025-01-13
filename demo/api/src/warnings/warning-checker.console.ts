import { BlockInput, FlatBlocks } from "@comet/blocks-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";
import { v5 } from "uuid";

import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

@Injectable()
@Console()
export class WarningCheckerConsole {
    constructor(
        private readonly orm: MikroORM,
        private readonly discoverService: DiscoverService,
        private readonly entityManager: EntityManager,
        @InjectRepository(Warning) private readonly warningsRepository: EntityRepository<Warning>,
    ) {}

    @Command({
        command: "check-warnings",
        description: "Checks for warnings",
    })
    @CreateRequestContext()
    async execute(): Promise<void> {
        // TODO: (in the next PRs) Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)

        for (const rootBlockEntity of this.discoverService.discoverRootBlocks()) {
            const { metadata, column, block } = rootBlockEntity;

            const queryBuilderLimit = 100;
            const baseQueryBuilder = this.entityManager.createQueryBuilder(metadata.className);
            baseQueryBuilder.select(`id, "${column}"`).from(metadata.tableName).limit(queryBuilderLimit);
            let rootBlocks: Array<{ [key: string]: BlockInput }> = [];
            let offset = 0;

            do {
                const queryBuilder = baseQueryBuilder.clone();
                queryBuilder.offset(offset);
                rootBlocks = (await queryBuilder.getResult()) as Array<{ [key: string]: BlockInput }>;

                for (const rootBlock of rootBlocks) {
                    const blockData = block.blockDataFactory(block.blockInputFactory(rootBlock[column]));

                    const flatBlocks = new FlatBlocks(blockData, {
                        name: block.name,
                        visible: true,
                        rootPath: "root",
                    });
                    for (const node of flatBlocks.depthFirst()) {
                        const warnings = node.block.warnings();

                        if (warnings.length > 0) {
                            // TODO: (in the next PRs) auto resolve warnings

                            for (const warning of warnings) {
                                const type = "Block";
                                const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
                                const id = v5(`${metadata.tableName}${rootBlock["id"]};${warning.message}`, staticNamespace);
                                // TODO: (in the next PRs) add blockInfos/metadata
                                const warningEntity = await this.warningsRepository.findOne({ id });

                                if (warningEntity) {
                                    warningEntity.assign({
                                        type,
                                        severity: WarningSeverity[warning.severity],
                                    });
                                } else {
                                    await this.warningsRepository.create({
                                        id,
                                        type,
                                        message: warning.message,
                                        severity: WarningSeverity[warning.severity],
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
    }
}
