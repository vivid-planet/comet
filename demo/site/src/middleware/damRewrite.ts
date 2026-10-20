import { createMiddleware } from "hono/factory";
import { proxy } from "hono/proxy";

export const damRewriteMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path.startsWith("/dam/")) {
        return proxy(`${process.env.API_URL_INTERNAL}${c.req.path}`, {
            method: c.req.method,
            headers: { ...c.req.header(), host: undefined },
        });
    }
    await next();
});
