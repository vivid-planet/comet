import { router } from "@src/app/router";
import { createMiddleware } from "hono/factory";

const skipFiles = ["/favicon.ico", "/apple-icon.png", "/icon.svg", "/manifest.json"];
const skipPaths = ["/assets/", "/_assets/", "/api/"];

export const skipRewriteMiddleware = createMiddleware(async (c, next) => {
    if (skipFiles.some((file) => c.req.path === file) || skipPaths.some((path) => c.req.path.startsWith(path))) {
        return router.fetch(c.req.raw);
    }
    await next();
});
