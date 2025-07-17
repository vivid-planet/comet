import { previewParams } from "@comet/site-nextjs";
import type { PublicSiteConfig } from "@src/site-configs";
import { headers } from "next/headers";

export function getHostByHeaders(headers: Headers) {
    const host = headers.get("x-forwarded-host") ?? headers.get("host");
    if (!host) throw new Error("Could not evaluate host");
    return host;
}

export function getSiteConfigForDomain(domain: string) {
    const siteConfig = getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === domain);
    if (!siteConfig) throw new Error(`SiteConfig not found for domain ${domain}`);
    return siteConfig;
}

export async function getSiteConfigForHeaders(headers: Headers) {
    const sitePreviewParams = await previewParams({ skipDraftModeCheck: true });
    if (sitePreviewParams?.scope) {
        const siteConfig = getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === sitePreviewParams.scope.domain);
        if (siteConfig) return siteConfig;
    }

    if (headers.has("x-comet-block-preview-domain")) {
        const domain = headers.get("x-comet-block-preview-domain");
        return getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === domain);
    } else {
        const host = getHostByHeaders(headers);
        return getSiteConfigs().find((siteConfig) => siteConfig.domains.main === host || siteConfig.domains.preliminary === host);
    }
}

let siteConfigs: PublicSiteConfig[];
export function getSiteConfigs() {
    if (!siteConfigs) {
        const json = process.env.PUBLIC_SITE_CONFIGS;
        if (!json) throw new Error("process.env.PUBLIC_SITE_CONFIGS must be set.");
        siteConfigs = JSON.parse(atob(json)) as PublicSiteConfig[];
    }
    return siteConfigs;
}

// Used for getting SiteConfig in server-components where params is not available (e.g. sitemap, not-found - see https://github.com/vercel/next.js/discussions/43179)
export async function getSiteConfig() {
    const siteConfig = await getSiteConfigForHeaders(headers());
    if (!siteConfig) throw new Error(`SiteConfig not found for host ${getHostByHeaders(headers())}`);
    return siteConfig;
}
