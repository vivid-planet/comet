import { migrationsList as brevoMigrationsList } from "@comet/brevo-api";
import { createMigrationsList, createOrmConfig } from "@comet/cms-api";
import { type EntityProperty, type Platform, Type } from "@mikro-orm/core";
import { defineConfig, EntityCaseNamingStrategy } from "@mikro-orm/postgresql";
import path from "path";

// Custom type that uses TEXT instead of VARCHAR
class TextStringType extends Type<string | null | undefined, string | null | undefined> {
    override getColumnType(prop: EntityProperty, platform: Platform): string {
        return "text";
    }

    override compareAsType(): string {
        return "string";
    }

    override ensureComparable(): boolean {
        return false;
    }
}

export const ormConfig = createOrmConfig(
    defineConfig({
        host: process.env.POSTGRESQL_HOST,
        port: Number(process.env.POSTGRESQL_PORT),
        user: process.env.POSTGRESQL_USER,
        password: Buffer.from(process.env.POSTGRESQL_PWD ?? "", "base64")
            .toString("utf-8")
            .trim(),
        dbName: process.env.POSTGRESQL_DB,
        driverOptions: {
            connection: { ssl: process.env.POSTGRESQL_USE_SSL === "true" },
        },
        namingStrategy: EntityCaseNamingStrategy,
        debug: false,
        discovery: {
            getMappedType(type: string, platform: Platform) {
                // Map all string types to TEXT instead of VARCHAR
                if (type === "string") {
                    return new TextStringType();
                }
                return undefined;
            },
        },
        migrations: {
            tableName: "Migrations",
            //  `path` is only used to tell MikroORM where to place newly generated migrations. Available migrations are defined using `migrationsList`.
            path: "./src/db/migrations",
            migrationsList: [...brevoMigrationsList, ...createMigrationsList(path.resolve(__dirname, "migrations"))],
            disableForeignKeys: false,
            dropTables: false,
            snapshot: false,
        },
    }),
);
