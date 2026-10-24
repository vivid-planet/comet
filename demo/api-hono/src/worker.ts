import { provide, R2BlobStorage } from "@dextinity/cms-hono";
import { drizzle } from "drizzle-orm/postgres-js";
import type { Context } from "hono";
import postgres from "postgres";

import { createApp } from "./app.ts";
import { createConfig } from "./config.ts";

interface Bindings {
    HYPERDRIVE: Hyperdrive;
    DAM_FILES: R2Bucket;
    /** e.g. `s3://<bucket>/` when imgproxy reads from R2 through its S3-compatible API. Without it, imgproxy loads images from their DAM URL. */
    R2_IMGPROXY_SOURCE_URL_PREFIX?: string;
}

let app: ReturnType<typeof createApp> | undefined;

export default {
    fetch(request, env, executionContext) {
        // Created once per isolate, the environment doesn't change between requests
        app ??= createApp(createConfig(env as unknown as Record<string, unknown>), {
            // Hyperdrive pools the connections, so a client per request is cheap. It must not outlive the request.
            database: provide(
                "db",
                (c: Context<{ Bindings: Bindings }>) => drizzle(postgres(c.env.HYPERDRIVE.connectionString, { max: 5, fetch_types: false })),
                { dispose: (db, c) => c.executionCtx.waitUntil(db.$client.end()) },
            ),
            blobStorage: provide(
                "blobStorage",
                (c: Context<{ Bindings: Bindings }>) =>
                    new R2BlobStorage(c.env.DAM_FILES, { imgproxySourceUrlPrefix: c.env.R2_IMGPROXY_SOURCE_URL_PREFIX }),
            ),
        });
        return app.fetch(request, env, executionContext);
    },
} satisfies ExportedHandler<Bindings>;
