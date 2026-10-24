/**
 * Prepares the local databases: `node scripts/database.ts <sqlite|postgresql> <migrate|seed>`.
 * D1 is migrated with `wrangler d1 migrations apply`, PostgreSQL with Drizzle's migrator.
 */
import { createD1Database, createPostgresqlDatabase, type Database, type DatabaseDialect } from "@dextinity/serverless-core/server";
import { createPermissionsSchema } from "@dextinity/serverless-permissions/server";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { getPlatformProxy } from "wrangler";

const [dialect, command] = process.argv.slice(2) as [DatabaseDialect, "migrate" | "seed"];

const { POSTGRESQL_HOST, POSTGRESQL_PORT, POSTGRESQL_USER, POSTGRESQL_PWD_DECODED, POSTGRESQL_DB } = process.env;
const postgresqlOptions = { host: POSTGRESQL_HOST, port: Number(POSTGRESQL_PORT), user: POSTGRESQL_USER, password: POSTGRESQL_PWD_DECODED };
/** A database of its own next to the one of the NestJS demo, whose tables have the same names */
const postgresqlDatabaseName = `${POSTGRESQL_DB}_serverless`;

/** Grants and roles of the users of the Access emulator (see vite.config.mts). Admins get all permissions by rule. */
async function seed(database: Database): Promise<void> {
    const { roles, groupRoles, userRoles, userPermissions } = createPermissionsSchema(database.dialect);
    await database.batch((db) => [
        db.delete(groupRoles),
        db.delete(userRoles),
        db.delete(userPermissions),
        db.delete(roles),
        db.insert(roles).values({ id: "dam-editor", name: "DAM editor", permissions: ["dam"] }),
        // Members of the editors group in the identity provider may use the DAM of the main domain
        db.insert(groupRoles).values({ group: "editors", roleId: "dam-editor", contentScopes: [{ domain: "main" }] }),
        db.insert(userPermissions).values({ userId: "3", permission: "dam", contentScopes: [{ domain: "secondary" }], reason: "Demo grant" }),
    ]);
}

if (dialect === "sqlite") {
    const { env, dispose } = await getPlatformProxy<{ DB: Parameters<typeof createD1Database>[0] }>();
    if (command === "seed") {
        await seed(createD1Database(env.DB));
    }
    await dispose();
} else {
    const server = postgres({ ...postgresqlOptions, database: POSTGRESQL_DB });
    const [{ exists }] = await server`select exists(select 1 from pg_database where datname = ${postgresqlDatabaseName})`;
    if (!exists) {
        await server.unsafe(`create database "${postgresqlDatabaseName}"`);
    }
    await server.end();

    const client = postgres({ ...postgresqlOptions, database: postgresqlDatabaseName, onnotice: () => {} });
    if (command === "migrate") {
        await migrate(drizzle(client), { migrationsFolder: "migrations/postgresql" });
    } else {
        await seed(createPostgresqlDatabase(drizzle(client)));
    }
    await client.end();
}
console.info(`${command} ${dialect}: done`);
