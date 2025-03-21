import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { EmitWarningsServiceInterface } from "src/warnings/decorators/emit-warnings.decorator";

import { WarningInput } from "../../warnings/dto/warning.input";
import { WarningSeverity } from "../../warnings/dto/warning-severity.enum";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileInterface } from "./entities/file.entity";
import { LicenseType } from "./entities/license.embeddable";

@Injectable()
export class FileWarningService implements EmitWarningsServiceInterface<FileInterface> {
    constructor(
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        private readonly entityManager: EntityManager,
    ) {}

    async emitWarningsBulk() {
        if (!this.config.enableLicenseFeature) return []; // license feature not enabled, no warnings

        const soonToExpireDate = new Date();
        soonToExpireDate.setDate(soonToExpireDate.getDate() - 30);

        const filterQuery: FilterQuery<FileInterface> = [
            {
                license: {
                    durationTo: {
                        $ne: soonToExpireDate,
                    },
                },
            },
        ];
        if (this.config.requireLicense) {
            filterQuery.push({ license: null });
        }

        const files = await this.entityManager.getRepository<FileInterface>("DamFile").find(
            {
                $or: filterQuery,
            },
            { limit: 100, offset: 0 },
        );

        let warnings: WarningInput[] = [];
        for (const file of files) {
            const newWarnings = await this.emitWarnings(file);
            warnings = warnings.concat(newWarnings);
        }

        return warnings;
    }

    async emitWarnings(entity: FileInterface) {
        if (!this.config.enableLicenseFeature) return []; // license feature not enabled, no warnings

        const warnings: WarningInput[] = [];

        if (entity.license?.durationTo) {
            const soonToExpireDate = new Date();
            soonToExpireDate.setDate(soonToExpireDate.getDate() - 30);

            if (entity.license.durationTo < new Date()) {
                warnings.push({
                    severity: WarningSeverity.critical,
                    message: "fileLicenseExpired",
                });
            } else if (entity.license.durationTo < soonToExpireDate) {
                warnings.push({
                    severity: WarningSeverity.high,
                    message: "fileLicenseSoonToExpire",
                });
            }
        }

        // if license feature is required, check if licenses are set
        if (this.config.requireLicense) {
            if (!entity.license?.durationTo && entity.license?.type !== LicenseType.ROYALTY_FREE) {
                warnings.push({
                    severity: WarningSeverity.critical,
                    message: "fileLicenseRequired",
                });
            }
        }

        return warnings;
    }
}
