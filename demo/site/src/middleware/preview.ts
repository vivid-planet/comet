import { router } from "@src/app/router";
import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { createMiddleware } from "hono/factory";

export const previewMiddleware = createMiddleware(async (c, next) => {
    // Block preview is always allowed
    if (c.req.path.startsWith("/block-preview/")) {
        // don't apply any other middlewares
        return router.fetch(c.req.raw);
    }

    // Api url for invoking site-preview is always allowed
    if (c.req.path === "/site-preview") {
        // don't apply any other middlewares
        return router.fetch(c.req.raw);
    }

    // Check if scope has been set via the site-preview api url
    const host = getHostByHeaders(c.req.raw.headers);
    if (host === process.env.PREVIEW_DOMAIN) {
        const siteConfig = await getSiteConfigForHost(host);
        if (!siteConfig) {
            return c.json({ error: "Preview has to be called from within Dextinity Web preview" }, 404);
        }
    }

    await next();
});
