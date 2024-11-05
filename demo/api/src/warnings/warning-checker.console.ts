import { BlockInput, FlatBlocks } from "@comet/blocks-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Command, Console } from "nestjs-console";

import { Warning } from "./entities/warning.entity";

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
        // TODO: Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)

        for (const rootBlockEntity of this.discoverService.discoverRootBlocks()) {
            const { metadata, column, block } = rootBlockEntity;

            const queryBuilder = this.entityManager.createQueryBuilder(metadata.className);
            queryBuilder.select(`id, "${column}"`).from(metadata.tableName);
            const rootBlocks = (await queryBuilder.getResult()) as Array<{ [key: string]: BlockInput }>;

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
                        // TODO: auto resolve warnings

                        for (const warning of warnings) {
                            const type = "Block";
                            const uniqueIdentifier = `${metadata.tableName};${rootBlock["id"]};${type};${node.pathToString()};${warning.message}`;
                            const warningEntity = await this.warningsRepository.findOne({ uniqueIdentifier });

                            if (warningEntity) {
                                warningEntity.assign({
                                    type,
                                    message: warning.message,
                                    severity: warning.severity,
                                    uniqueIdentifier,
                                });
                            } else {
                                await this.warningsRepository.create({
                                    type,
                                    message: warning.message,
                                    severity: warning.severity,
                                    uniqueIdentifier,
                                });
                            }
                        }
                    }
                }
                await this.entityManager.flush();
            }
        }
    }
}
