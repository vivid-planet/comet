import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase | undefined;

export function getDb(): PostgresJsDatabase {
    if (!db) {
        const password = Buffer.from(process.env.POSTGRESQL_PWD ?? "", "base64")
            .toString("utf-8")
            .trim();
        const client = postgres({
            host: process.env.POSTGRESQL_HOST,
            port: Number(process.env.POSTGRESQL_PORT ?? 5432),
            username: process.env.POSTGRESQL_USER,
            password,
            database: process.env.POSTGRESQL_DB,
        });
        db = drizzle(client);
    }
    return db;
}
