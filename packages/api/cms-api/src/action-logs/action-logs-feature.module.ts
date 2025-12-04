import { Module } from "@nestjs/common";

import { ActionLogsService } from "./action-logs.service";

@Module({
    providers: [ActionLogsService],
    exports: [ActionLogsService],
})
export class ActionLogsFeatureModule {}
