import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";
import { WarningCheckerCommand } from "./warning-checker.command";

@Module({
    imports: [MikroOrmModule.forFeature([Warning])],
    providers: [WarningResolver, WarningCheckerCommand],
})
export class WarningsModule {}
