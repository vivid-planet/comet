import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { v5 } from "uuid";

import { CreateWarningInput } from "./dto/create-warning.input";
import { WarningSourceInfo } from "./dto/warning-source-info";
import { Warning } from "./entities/warning.entity";

@Injectable()
export class WarningService {
    constructor(private readonly entityManager: EntityManager) {}

    private async saveWarning({
        warning,
        type,
        sourceInfo,
    }: {
        warning: CreateWarningInput;
        type: string;
        sourceInfo: WarningSourceInfo;
    }): Promise<void> {
        const staticNamespace = "4e099212-0341-4bc8-8f4a-1f31c7a639ae";
        const id = v5(`${sourceInfo.rootEntityName}${sourceInfo.targetId};${warning.message}`, staticNamespace);

        await this.entityManager.upsert(
            Warning,
            {
                createdAt: new Date(),
                updatedAt: new Date(),
                id,
                type,
                message: warning.message,
                severity: warning.severity,
                sourceInfo,
            },
            { onConflictExcludeFields: ["createdAt"] },
        );
    }

    public async saveWarnings({
        warnings,
        type,
        sourceInfo,
    }: {
        warnings: CreateWarningInput[];
        type: string;
        sourceInfo: WarningSourceInfo;
    }): Promise<void> {
        for (const warning of warnings) {
            await this.saveWarning({
                warning,
                type,
                sourceInfo,
            });
        }
    }

    public async saveWarningsAndDeleteOutdated({
        warnings,
        type,
        sourceInfo,
    }: {
        warnings: CreateWarningInput[];
        type: string;
        sourceInfo: WarningSourceInfo;
    }): Promise<void> {
        const startDate = new Date();
        for (const warning of warnings) {
            await this.saveWarning({
                warning,
                type,
                sourceInfo,
            });
        }
        this.deleteOutdatedWarnings(startDate, type, sourceInfo);
    }

    public async deleteOutdatedWarnings(date: Date, type: string, sourceInfo: WarningSourceInfo): Promise<void> {
        await this.entityManager.nativeDelete(Warning, { type, updatedAt: { $lt: date }, sourceInfo });
    }
}
