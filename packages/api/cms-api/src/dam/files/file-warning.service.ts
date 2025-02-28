import { Injectable } from "@nestjs/common";
import { BlockWarning } from "src/blocks/block";
import { EmitWarningsServiceInterface } from "src/warnings/decorators/emit-warnings.decorator";

import { FileInterface } from "./entities/file.entity";

@Injectable()
export class FileWarningService implements EmitWarningsServiceInterface<FileInterface> {
    // maybe add something to restrict where query so not every file has to be checked
    async emitWarnings(entity: FileInterface): Promise<BlockWarning[]> {
        const warnings: BlockWarning[] = [];

        if (entity.license?.durationTo) {
            const soonToExpireDate = new Date(entity.license.durationTo);
            soonToExpireDate.setDate(soonToExpireDate.getDate() - 30);
            if (entity.license.durationTo < new Date()) {
                warnings.push({
                    severity: "critical",
                    message: "file.license.expired",
                });
            } else if (soonToExpireDate < new Date()) {
                warnings.push({
                    severity: "high",
                    message: "file.license.soonToExpire",
                });
            }
        }

        return warnings;
    }
}
