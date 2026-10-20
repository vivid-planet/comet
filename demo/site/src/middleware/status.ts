import { createMiddleware } from "hono/factory";

export const statusMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === "/api/status") {
        return c.json({ status: "OK" }, 200, { "cache-control": "no-store" });
    }
    await next();
});
