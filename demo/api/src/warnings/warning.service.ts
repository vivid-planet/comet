import { BlockWarning } from "@comet/blocks-api";
import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { v5 } from "uuid";

import { WarningBlockInfo } from "./dto/warning-block-info";
import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

@Injectable()
export class WarningService {
    constructor(private readonly orm: MikroORM, private readonly entityManager: EntityManager) {}

    public async saveWarning({
        rootEntityName,
        rootBlockId,
        warningMessage,
        warningSeverity,
        rootColumnName,
    }: {
        rootEntityName: string;
        rootBlockId: string;
        warningMessage: string;
        warningSeverity: string;
        rootColumnName: string;
    }): Promise<void> {
        const type = "Block";
        const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
        const id = v5(`${rootEntityName}${rootBlockId};${warningMessage}`, staticNamespace);

        await this.entityManager.upsert(
            Warning,
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                id,
                type,
                message: warningMessage,
                severity: WarningSeverity[warningSeverity as keyof typeof WarningSeverity],
                blockInfo: {
                    rootEntityName: rootEntityName,
                    rootColumnName: rootColumnName,
                    rootPrimaryKey: "id",
                    targetId: rootBlockId,
                },
            },
            { onConflictExcludeFields: ["createdAt"] },
        );
    }

    public async updateWarningsForBlock(warnings: BlockWarning[], blockInfo: WarningBlockInfo): Promise<void> {
        const startDate = new Date();
        for (const warning of warnings) {
            await this.saveWarning({
                warningMessage: warning.message,
                warningSeverity: warning.severity,
                rootBlockId: blockInfo.targetId,
                rootColumnName: blockInfo.rootColumnName,
                rootEntityName: blockInfo.rootEntityName,
            });
        }
        const bufferTime = startDate.setSeconds(startDate.getSeconds() - 1); // Create a buffer time by subtracting 1 second from the startDate to avoid deleting records inserted in the same second
        this.deleteOutdatedWarnings(new Date(bufferTime), blockInfo);
    }

    public async deleteOutdatedWarnings(date: Date, blockInfo: WarningBlockInfo): Promise<void> {
        await this.entityManager.nativeDelete(Warning, { type: "Block", updatedAt: { $lt: date }, blockInfo });
    }
}
