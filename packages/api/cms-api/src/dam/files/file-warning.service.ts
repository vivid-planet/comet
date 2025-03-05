import { Inject, Injectable } from "@nestjs/common";
import { BlockWarning } from "src/blocks/block";
import { EmitWarningsServiceInterface } from "src/warnings/decorators/emit-warnings.decorator";

import { DamConfig } from "../dam.config";
import { DAM_CONFIG } from "../dam.constants";
import { FileInterface } from "./entities/file.entity";
import { LicenseType } from "./entities/license.embeddable";

@Injectable()
export class FileWarningService implements EmitWarningsServiceInterface<FileInterface> {
    constructor(@Inject(DAM_CONFIG) private readonly config: DamConfig) {}

    async emitWarnings(entity: FileInterface): Promise<BlockWarning[]> {
        const warnings: BlockWarning[] = [];

        // If license feature is enabled, check for expired licenses
        if (this.config.enableLicenseFeature && entity.license?.durationTo) {
            const soonToExpireDate = new Date(entity.license.durationTo);
            soonToExpireDate.setDate(soonToExpireDate.getDate() - 30);

            if (entity.license.durationTo < new Date()) {
                warnings.push({
                    severity: "critical",
                    message: "fileLicenseExpired",
                });
            } else if (soonToExpireDate < new Date()) {
                warnings.push({
                    severity: "high",
                    message: "fileLicenseSoonToExpire",
                });
            }
        }

        // if license feature is required, check if licenses are set
        if (this.config.requireLicense) {
            if (!entity.license?.durationTo && entity.license?.type !== LicenseType.ROYALTY_FREE) {
                warnings.push({
                    severity: "critical",
                    message: "fileLicenseRequired",
                });
            }
        }

        return warnings;
    }
}
