import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";
import { WarningCheckerConsole } from "./warning-checker.console";

@Module({
    imports: [MikroOrmModule.forFeature([Warning])],
    providers: [WarningResolver, WarningCheckerConsole],
})
export class WarningsModule {}
