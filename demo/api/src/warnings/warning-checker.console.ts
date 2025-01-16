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
                            (indexObj->>'visible')::boolean       "visible",
                            warningObj->>'severity'               "warningSeverity",
                            warningObj->>'message'                "warningMessage"
                        FROM "${metadata.tableName}",
                            json_array_elements("${metadata.tableName}"."${column}"->'index') indexObj,
                            json_array_elements(indexObj->'warnings') warningObj`;

            indexSelects.push(select);
        }

        const sql = indexSelects.join("\n UNION ALL \n");
        //console.log(sql);
        console.time("query all blocks for warnings");
        const warnings = await this.entityManager.execute(sql); //TODO paging
        console.timeEnd("query all blocks for warnings");

        // TODO: (in the next PRs) auto resolve warnings
        console.time("write warnings in database");
        for (const warning of warnings) {
            const type = "Block";
            const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
            const id = v5(`${warning.rootTableName}${warning.rootId};${warning.warningMessage}`, staticNamespace);
            // TODO: (in the next PRs) add blockInfos/metadata

            await this.entityManager.upsert(
                Warning,
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    id,
                    type,
                    message: warning.warningMessage,
                    severity: WarningSeverity[warning.warningSeverity as WarningSeverity],
                },
                { onConflictExcludeFields: ["createdAt"] },
            );
        }
        console.timeEnd("write warnings in database");

        await this.entityManager.flush();
    }
}
