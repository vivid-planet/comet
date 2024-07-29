import { MikroOrmModule } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { FixturesModule } from "@src/db/fixtures/fixtures.module";

import { MigrateConsole } from "./migrate.console";
import { ormConfig } from "./ormconfig";

@Module({
    imports: [MikroOrmModule.forRoot({ ormConfig }), FixturesModule],
    providers: [MigrateConsole],
})
export class DbModule {}
