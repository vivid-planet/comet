import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { z } from "zod";

import type { BlobStorage } from "../blob-storage/blob-storage.js";
import { inject } from "../core/provide.js";
import type { ImgproxyService } from "../imgproxy/imgproxy.js";
import { damDefaultAcceptedMimetypes } from "./common/dam-default-accepted-mimetypes.js";
import { type DamConfig, damDefaultBasePath, type ResolvedDamConfig } from "./dam.config.js";
import { createDamRouteHelpers, type DamEnv, type DamRouteContext, type DamScopeSchema } from "./dam.context.js";
import { createDamServices, type DamServiceDependencies, type DextinityDatabase } from "./dam.services.js";
import { createDamSchema, DamScopeColumns } from "./db/dam.schema.js";
import { createFilesRoutes } from "./files/files.routes.js";
import { createFoldersRoutes } from "./folders/folders.routes.js";
import { createImagesRoutes } from "./images/images.routes.js";
import { createDamItemsRoutes } from "./items/dam-items.routes.js";

interface DamModuleOptions<TScopeSchema extends DamScopeSchema> {
    damConfig: DamConfig;
    Scope?: TScopeSchema;
}

/**
 * The counterpart of `DamModule.register()`:
 *
 * - `schema`: the Drizzle tables (entities)
 * - `provider`: middleware that creates the DAM services for the request and provides them as `c.var.dam` (providers and exports)
 * - `routes`: the REST routes, mount them with `app.route(basePath, dam.routes)` (controllers and resolvers)
 *
 * The module requires `db`, `blobStorage`, `currentUser` and `accessControl` and optionally `imgproxy` in the request context (imports).
 */
export function createDamModule<TScopeSchema extends DamScopeSchema = z.ZodObject<Record<never, never>>>({
    damConfig,
    Scope,
}: DamModuleOptions<TScopeSchema>) {
    const scopeSchema = (Scope ?? z.object({})) as TScopeSchema;
    const scopeKeys = Object.keys(scopeSchema.shape);
    const config: ResolvedDamConfig = {
        ...damConfig,
        basePath: damConfig.basePath ?? damDefaultBasePath,
        acceptedMimeTypes: damConfig.acceptedMimeTypes ?? damDefaultAcceptedMimetypes,
    };
    const schema = createDamSchema({ scopeKeys });
    const scopeColumns = new DamScopeColumns(scopeKeys);

    const createServices = (dependencies: Pick<DamServiceDependencies, "db" | "blobStorage" | "imgproxy">) =>
        createDamServices({ ...dependencies, config, schema, scopeColumns });

    const provider = createMiddleware<DamEnv>(async (c, next) => {
        c.set(
            "dam",
            createServices({
                db: inject<DextinityDatabase>(c, "db", "DamModule"),
                blobStorage: inject<BlobStorage>(c, "blobStorage", "DamModule"),
                imgproxy: c.get("imgproxy") as ImgproxyService | undefined,
            }),
        );
        await next();
    });

    const routeContext: DamRouteContext<TScopeSchema> = { config, scopeSchema, hasScope: scopeKeys.length > 0 };
    const helpers = createDamRouteHelpers(routeContext);

    const routes = new Hono<DamEnv>()
        .use(provider)
        .route("/files", createFilesRoutes(routeContext, helpers))
        .route("/folders", createFoldersRoutes(routeContext, helpers))
        .route("/items", createDamItemsRoutes(routeContext, helpers))
        .route("/images", createImagesRoutes(routeContext, helpers));

    return { config, schema, provider, routes, createServices };
}

export type DamModule<TScopeSchema extends DamScopeSchema> = ReturnType<typeof createDamModule<TScopeSchema>>;

/** The route types of the DAM, for typed clients: `hc<DamRoutes<typeof DamScope>>(\`${apiUrl}/dam\`)`. */
export type DamRoutes<TScopeSchema extends DamScopeSchema> = DamModule<TScopeSchema>["routes"];
