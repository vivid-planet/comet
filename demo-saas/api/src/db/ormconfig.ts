import { createMigrationsList, createOrmConfig as createCometOrmConfig } from "@comet/cms-api";
import { defineConfig, EntityCaseNamingStrategy } from "@mikro-orm/postgresql";
import path from "path";

interface Options {
    user?: string;
    password?: string;
    contextName?: string;
}

export function createOrmConfig({ user, password, contextName }: Options) {
    return createCometOrmConfig(
        defineConfig({
            ...ormConfig,
            user,
            password: Buffer.from(password ?? "", "base64")
                .toString("utf-8")
                .trim(),
            contextName,
        }),
    );
}

const ormConfig = {
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    dbName: process.env.POSTGRESQL_DB,
    driverOptions: {
        connection: { ssl: process.env.POSTGRESQL_USE_SSL === "true" },
    },
    namingStrategy: EntityCaseNamingStrategy,
    debug: false,
    migrations: {
        tableName: "Migrations",
        //  `path` is only used to tell MikroORM where to place newly generated migrations. Available migrations are defined using `migrationsList`.
        path: "./src/db/migrations",
        migrationsList: createMigrationsList(path.resolve(__dirname, "migrations")),
        disableForeignKeys: false,
        dropTables: false,
        snapshot: false,
    },
};
