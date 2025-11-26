import { type Options } from "@mikro-orm/postgresql";

import { ormConfig } from "./ormconfig";

const config: Options = {
    ...ormConfig,
    entities: ["./dist/**/*.entity.js"],
    entitiesTs: ["./src/**/*.entity.ts"],
};

export = config;
