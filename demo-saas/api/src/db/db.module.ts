import { Module } from "@nestjs/common";
import { FixturesModule } from "@src/db/fixtures/fixtures.module";

import { MigrateCommand } from "./migrate.command";
import { createOrmModules } from "./orm-modules.factory";

@Module({
    imports: [...createOrmModules(), FixturesModule],
    providers: [MigrateCommand],
})
export class DbModule {}
