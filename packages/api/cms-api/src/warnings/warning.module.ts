import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./warning.resolver";
import { WarningService } from "./warning.service";
import { WarningCheckerCommand } from "./warning-checker.command";
import { WarningEventSubscriber } from "./warning-event-subscriber";

@Module({
    imports: [MikroOrmModule.forFeature([Warning])],
    providers: [WarningResolver, WarningCheckerCommand, WarningService, WarningEventSubscriber],
    exports: [WarningService],
})
export class WarningsModule {}
