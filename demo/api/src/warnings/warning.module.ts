import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PagesModule } from "@src/pages/pages.module";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";
import { WarningCheckerConsole } from "./warning-checker.console";

@Module({
    imports: [MikroOrmModule.forFeature([Warning]), PagesModule],
    providers: [WarningResolver, WarningCheckerConsole],
})
export class WarningsModule {}
