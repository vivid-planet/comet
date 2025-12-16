import { type Options } from "@mikro-orm/postgresql";

import { createOrmConfig } from "./ormconfig";

const config: Options = {
    ...createOrmConfig({
        user: process.env.POSTGRESQL_USER,
        password: Buffer.from(process.env.POSTGRESQL_PWD ?? "", "base64")
            .toString("utf-8")
            .trim(),
    }),
    entities: ["./dist/**/*.entity.js"],
    entitiesTs: ["./src/**/*.entity.ts"],
};

export = config;
