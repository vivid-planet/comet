import { createDamModule, dextinityErrorHandler, ImgproxyService, provide } from "@dextinity/cms-hono";
import { Hono, type MiddlewareHandler } from "hono";

import { authentication } from "./auth.ts";
import type { Config } from "./config.ts";
import { DamScope } from "./dam/dam-scope.ts";

interface RuntimeProviders {
    /** Provides `db`, a Drizzle database */
    database: MiddlewareHandler;
    /** Provides `blobStorage` */
    blobStorage: MiddlewareHandler;
}

/**
 * The counterpart of `AppModule`. Runtime-specific dependencies (database driver, blob storage) are passed in by the entry points
 * for Node.js (`node.ts`) and Cloudflare Workers (`worker.ts`).
 */
export function createApp(config: Config, { database, blobStorage }: RuntimeProviders) {
    const dam = createDamModule({ damConfig: config.dam, Scope: DamScope });
    const imgproxy = new ImgproxyService(config.imgproxy);

    return new Hono()
        .onError(dextinityErrorHandler)
        .use(database)
        .use(blobStorage)
        .use(provide("imgproxy", () => imgproxy))
        .use(authentication({ apiToken: config.apiToken }))
        .get("/status", (c) => c.json({ status: "ok" }))
        .route(`/${dam.config.basePath}`, dam.routes);
}

export type AppType = ReturnType<typeof createApp>;
