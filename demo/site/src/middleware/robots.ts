import { router } from "@src/app/router";
import { createMiddleware } from "hono/factory";

export const robotsMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === "/robots.txt") {
        // don't apply any other middlewares
        return router.fetch(c.req.raw);
    }
    await next();
});
