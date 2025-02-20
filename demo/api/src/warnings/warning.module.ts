import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PagesModule } from "@src/documents/pages/pages.module";

import { Warning } from "./entities/warning.entity";
import { WarningResolver } from "./generated/warning.resolver";
import { WarningCheckerCommand } from "./warning-checker.command";

@Module({
    imports: [MikroOrmModule.forFeature([Warning]), PagesModule],
    providers: [WarningResolver, WarningCheckerCommand],
})
export class WarningsModule {}
