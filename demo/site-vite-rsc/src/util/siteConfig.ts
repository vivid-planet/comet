//import { previewParams } from "@comet/site-react";
import type { PublicSiteConfig } from "@src/site-configs";

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

export async function getSiteConfigForHost(host: string) {
    /*
    const sitePreviewParams = await previewParams({ skipDraftModeCheck: true });
    if (sitePreviewParams?.scope) {
        const siteConfig = getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === sitePreviewParams.scope.domain);
        if (siteConfig) return siteConfig;
    }
        */
    return getSiteConfigs().find((siteConfig) => siteConfig.domains.main === host || siteConfig.domains.preliminary === host);
}

/*
export async function getSiteConfigForRequest(request: Request) {
    const cookie = request.cookies?.__comet_preview;
    if (cookie) {
        const sitePreviewParams = await verifySitePreviewJwt(cookie);
        if (sitePreviewParams?.scope) {
            const siteConfig = getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === sitePreviewParams.scope.domain);
            if (siteConfig) return siteConfig as PublicSiteConfig;
        }
    }
    

    const host = request.header("host");
    if (!host) throw new Error("Host header is required");
    return getSiteConfigForHost(host);
}
*/

let siteConfigs: PublicSiteConfig[];
export function getSiteConfigs() {
    if (!siteConfigs) {
        const json = avoidInliningEnv(process.env);
        function avoidInliningEnv(env: any) {
            if (!env) throw new Error("process.env must be set.");
            return env.PUBLIC_SITE_CONFIGS;
        }
        if (!json) throw new Error("process.env.PUBLIC_SITE_CONFIGS must be set.");
        siteConfigs = JSON.parse(atob(json)) as PublicSiteConfig[];
    }
    return siteConfigs;
}

// Used for getting SiteConfig in server-components where params is not available (e.g. sitemap, not-found - see https://github.com/vercel/next.js/discussions/43179)
export async function getSiteConfig() {
    const host = getHostByHeaders(headers());
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) throw new Error(`SiteConfig not found for host ${host}`);
    return siteConfig;
}
