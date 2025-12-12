import { MikroOrmModule } from "@comet/cms-api";
import { Module } from "@nestjs/common";
import { FixturesModule } from "@src/db/fixtures/fixtures.module";

import { MigrateCommand } from "./migrate.command";
import { createOrmConfig } from "./ormconfig";

@Module({
    imports: [
        MikroOrmModule.forRoot({
            ormConfig: createOrmConfig({ user: "app_user", password: "secret" }),
        }),
        MikroOrmModule.forRoot({
            ormConfig: createOrmConfig({
                user: process.env.POSTGRESQL_USER,
                password: Buffer.from(process.env.POSTGRESQL_PWD ?? "", "base64")
                    .toString("utf-8")
                    .trim(),
                contextName: "admin",
            }),
        }),
        FixturesModule,
    ],
    providers: [MigrateCommand],
})
export class DbModule {}
