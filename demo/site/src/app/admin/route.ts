import { getSiteContext } from "@src/framework/requestContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Context, Next } from "hono";

/**
 * Redirects to the admin of the site, if the admin URL is configured
 */
export async function adminRoute(c: Context, next: Next) {
    if (!process.env.ADMIN_URL) {
        return next();
    }
    const { domain } = getSiteContext();
    const language = getSiteConfigForDomain(domain).scope.languages[0];
    return c.redirect(new URL(`/${domain}/${language}`, process.env.ADMIN_URL).toString(), 307);
}
