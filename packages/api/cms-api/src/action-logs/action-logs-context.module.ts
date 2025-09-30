import { Module } from "@nestjs/common";

import { ActionLogsContextService } from "./action-logs-context.service";

@Module({
    providers: [ActionLogsContextService],
    exports: [ActionLogsContextService],
})
export class ActionLogsContextModule {}
