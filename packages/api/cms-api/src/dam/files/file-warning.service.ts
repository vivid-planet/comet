import { EntityManager, FilterQuery } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";

import { CreateWarningsServiceInterface } from "../../warnings/decorators/create-warnings.decorator";
import { WarningInput } from "../../warnings/dto/warning.input";
import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileInterface } from "./entities/file.entity";
import { LicenseType } from "./entities/license.embeddable";

@Injectable()
export class FileWarningService implements CreateWarningsServiceInterface<FileInterface> {
    constructor(
        @Inject(DAM_CONFIG) private readonly config: DamConfig,
        private readonly entityManager: EntityManager,
    ) {}

    async *bulkCreateWarnings() {
        if (!this.config.enableLicenseFeature) return; // license feature not enabled, no warnings

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

        let files = [];
        let offset = 0;
        const limit = 50;
        do {
            files = await this.entityManager.getRepository<FileInterface>("DamFile").find(
                {
                    $or: filterQuery,
                },
                { limit, offset },
            );

            for (const file of files) {
                const warnings = await this.createWarnings(file);
                yield { warnings, tableRowId: file.id };
            }
            offset += limit;
        } while (files.length > 0);
    }

    async createWarnings(entity: FileInterface) {
        if (!this.config.enableLicenseFeature) return []; // license feature not enabled, no warnings

        const warnings: WarningInput[] = [];

        if (entity.license?.durationTo) {
            const soonToExpireDate = new Date();
            soonToExpireDate.setDate(soonToExpireDate.getDate() + 30);

            if (entity.license.durationTo < new Date()) {
                warnings.push({
                    severity: "high",
                    message: "fileLicenseExpired",
                });
            } else if (entity.license.durationTo < soonToExpireDate) {
                warnings.push({
                    severity: "medium",
                    message: "fileLicenseSoonToExpire",
                });
            }
        }

        // if license feature is required, check if licenses are set
        if (this.config.requireLicense) {
            if (!entity.license?.durationTo && entity.license?.type !== LicenseType.ROYALTY_FREE) {
                warnings.push({
                    severity: "high",
                    message: "fileLicenseRequired",
                });
            }
        }

        return warnings;
    }
}
