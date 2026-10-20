import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { createMiddleware } from "hono/factory";

export const adminRedirectMiddleware = createMiddleware(async (c, next) => {
    if (c.req.path === "/admin" && process.env.ADMIN_URL) {
        const host = getHostByHeaders(c.req.raw.headers);
        const siteConfig = await getSiteConfigForHost(host);
        if (siteConfig) {
            const { domain, languages } = siteConfig.scope;
            const language = languages[0];
            return c.redirect(new URL(`/${domain}/${language}`, process.env.ADMIN_URL).toString(), 307);
        }
        return c.redirect(new URL(process.env.ADMIN_URL).toString(), 307);
    }
    await next();
});
