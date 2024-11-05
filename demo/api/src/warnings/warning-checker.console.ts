import { FlatBlocks } from "@comet/blocks-api";
import { DiscoverService } from "@comet/cms-api/lib/dependencies/discover.service";
import { Connection, CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { SeoBlock } from "@src/pages/blocks/seo.block";
import hasha from "hasha";
import { Command, Console } from "nestjs-console";

import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

@Injectable()
@Console()
export class WarningCheckerConsole {
    private connection: Connection;
    constructor(
        private readonly orm: MikroORM,
        private readonly discoverService: DiscoverService,
        private readonly entityManager: EntityManager,
        @InjectRepository(Warning) private readonly warningsRepository: EntityRepository<Warning>,
    ) {
        this.connection = entityManager.getConnection();
    }

    @Command({
        command: "check-warnings",
        description: "Checks for warnings",
    })
    @CreateRequestContext()
    async execute(): Promise<void> {
        // TODO: Check if data itself is valid in the database. (Maybe some data was put into database and is not correct or a migration was done wrong)

        for (const rootBlockEntity of this.discoverService.discoverRootBlocks()) {
            const { metadata, column, block } = rootBlockEntity;
            const sql = `SELECT id, "${column}" as "block" FROM "${metadata.tableName}";`;
            const rootBlocks = await this.connection.execute(sql);

            for (const rootBlock of rootBlocks) {
                const blockData = SeoBlock.blockInputFactory(rootBlock.block).transformToBlockData(); // don't use SeoBlock but maybe a generic Block. I need to call transformToBlockData o therwise the FlatBlocks function does not work
                // const blockData = block.blockDataFactory(rootBlock.block); // maybe something like this is the correct way - but this here does not work

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
                            const uniqueIdentifier = `${type};${node.pathToString()};${warning.message}`; // TODO: Is this enough to be unique?
                            const hash = hasha(uniqueIdentifier, { algorithm: "md5" });
                            const warningEntity = await this.warningsRepository.findOne({ uniqueIdentifier: hash });

                            if (warningEntity) {
                                warningEntity.assign({
                                    type,
                                    message: warning.message,
                                    severity: warning.severity as WarningSeverity, // TODO: remove as WarningSeverity, as soon as WarningSeverity type is in the package
                                    uniqueIdentifier: hash,
                                });
                            } else {
                                await this.warningsRepository.create({
                                    type,
                                    message: warning.message,
                                    severity: warning.severity as WarningSeverity, // TODO: remove as WarningSeverity, as soon as WarningSeverity type is in the package
                                    uniqueIdentifier: hash,
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
