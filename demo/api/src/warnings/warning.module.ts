import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";
import { WarningService } from "./warning.service";
import { WarningCheckerConsole } from "./warning-checker.console";
import { WarningEventSubscriber } from "./WarningEventSubscriber";

@Module({
    imports: [MikroOrmModule.forFeature([Warning])],
    providers: [WarningResolver, WarningCheckerConsole, WarningService, WarningEventSubscriber],
    exports: [WarningService],
})
export class WarningsModule {}
