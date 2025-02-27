import { BlockWarning } from "@comet/cms-api";
import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { v5 } from "uuid";

import { WarningDependencyInfo } from "./dto/warning-dependency-info";
import { Warning } from "./entities/warning.entity";
import { WarningSeverity } from "./entities/warning-severity.enum";

@Injectable()
export class WarningService {
    constructor(
        private readonly orm: MikroORM,
        private readonly entityManager: EntityManager,
    ) {}

    public async saveWarning({ warning, dependencyInfo }: { warning: BlockWarning; dependencyInfo: WarningDependencyInfo }): Promise<void> {
        const type = "Block";
        const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
        const id = v5(`${dependencyInfo.rootEntityName}${dependencyInfo.targetId};${warning.message}`, staticNamespace);

        await this.entityManager.upsert(
            Warning,
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                id,
                type,
                message: warning.message,
                severity: WarningSeverity[warning.severity as keyof typeof WarningSeverity],
                dependencyInfo,
            },
            { onConflictExcludeFields: ["createdAt"] },
        );
    }

    public async updateWarningsForBlock(warnings: BlockWarning[], dependencyInfo: WarningDependencyInfo): Promise<void> {
        const startDate = new Date();
        for (const warning of warnings) {
            await this.saveWarning({
                warning,
                dependencyInfo,
            });
        }
        this.deleteOutdatedWarnings(startDate, dependencyInfo);
    }

    public async deleteOutdatedWarnings(date: Date, dependencyInfo: WarningDependencyInfo): Promise<void> {
        await this.entityManager.nativeDelete(Warning, { type: "Block", updatedAt: { $lt: date }, dependencyInfo });
    }
}
