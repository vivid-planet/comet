import { provide } from "@dextinity/cms-hono";
import { FileSystemBlobStorage } from "@dextinity/cms-hono/node";
import { serve } from "@hono/node-server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { createApp } from "./app.ts";
import { createConfig } from "./config.ts";

const { POSTGRESQL_HOST, POSTGRESQL_PORT, POSTGRESQL_USER, POSTGRESQL_PWD_DECODED, POSTGRESQL_DB, FILE_STORAGE_PATH, API_HONO_PORT } = process.env;

// On Node.js, the connection pool and the storage are shared across requests
const db = drizzle(
    postgres({
        host: POSTGRESQL_HOST,
        port: Number(POSTGRESQL_PORT),
        user: POSTGRESQL_USER,
        password: POSTGRESQL_PWD_DECODED,
        database: POSTGRESQL_DB,
    }),
);
const blobStorage = new FileSystemBlobStorage({ path: FILE_STORAGE_PATH ?? "../uploads" });

const app = createApp(createConfig(process.env), {
    database: provide("db", () => db),
    blobStorage: provide("blobStorage", () => blobStorage),
});

const port = Number(API_HONO_PORT ?? 4010);
serve({ fetch: app.fetch, port }, () => console.info(`API (Hono, Node.js) listening on http://localhost:${port}`));
