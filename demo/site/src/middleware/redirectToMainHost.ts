import type { PublicSiteConfig } from "@src/site-configs";
import { getHostByHeaders, getSiteConfigForHost, getSiteConfigs } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

const normalizeDomain = (host: string) => (host.startsWith("www.") ? host.substring(4) : host);

const matchesHostWithAdditionalDomain = (siteConfig: PublicSiteConfig, host: string) => {
    if (normalizeDomain(siteConfig.domains.main) === normalizeDomain(host)) {
        return true;
    } // non-www redirect
    if (siteConfig.domains.additional?.map(normalizeDomain).includes(normalizeDomain(host))) {
        return true;
    }
    return false;
};

const matchesHostWithPattern = (siteConfig: PublicSiteConfig, host: string) => {
    if (!siteConfig.domains.pattern) {
        return false;
    }
    return new RegExp(siteConfig.domains.pattern).test(host);
};

/**
 * When http host isn't siteConfig.domains.main (instead .pattern or .additional match), redirect to main host.
 */
export function withRedirectToMainHostMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);

        if (!siteConfig) {
            // Redirect to Main Host
            const redirectSiteConfig =
                getSiteConfigs().find((siteConfig) => matchesHostWithAdditionalDomain(siteConfig, host)) ||
                getSiteConfigs().find((siteConfig) => matchesHostWithPattern(siteConfig, host));
            if (redirectSiteConfig) {
                return NextResponse.redirect(`https://${redirectSiteConfig.domains.main}${request.nextUrl.pathname}${request.nextUrl.search}`, {
                    status: 301,
                });
            }

            return NextResponse.json({ error: `Cannot resolve domain: ${host}` }, { status: 404 });
        }
        return middleware(request);
    };
}
