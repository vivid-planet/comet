import { createOrmConfig } from "@comet/cms-api";
import { type Options } from "@mikro-orm/postgresql";

const config: Options = {
    ...createOrmConfig({ user: process.env.POSTGRESQL_USER, password: process.env.POSTGRESQL_PWD }),
    entities: ["./dist/**/*.entity.js"],
    entitiesTs: ["./src/**/*.entity.ts"],
};

export = config;
