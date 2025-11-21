import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { v5 } from "uuid";

import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { WarningData } from "./dto/warning-data";
import { WarningSourceInfo } from "./dto/warning-source-info";
import { Warning } from "./entities/warning.entity";

@Injectable()
export class WarningService {
    constructor(private readonly entityManager: EntityManager) {}

    private async saveWarning({
        warning,
        sourceInfo,
        scope,
    }: {
        warning: WarningData;
        sourceInfo: WarningSourceInfo;
        scope?: ContentScope;
    }): Promise<void> {
        const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
        const id = v5(`${sourceInfo.rootEntityName}${sourceInfo.targetId};${warning.message}`, staticNamespace);

        await this.entityManager.upsert(
            Warning,
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                id,
                message: warning.message,
                severity: warning.severity,
                sourceInfo,
                scope,
            },
            { onConflictExcludeFields: ["createdAt"] },
        );
    }

    public async saveWarnings({
        warnings,
        sourceInfo,
        scope,
    }: {
        warnings: WarningData[];
        sourceInfo: WarningSourceInfo;
        scope?: ContentScope;
    }): Promise<void> {
        for (const warning of warnings) {
            await this.saveWarning({
                warning,
                sourceInfo,
                scope,
            });
        }
    }
}
