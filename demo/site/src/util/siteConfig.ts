import { previewParams, SitePreviewData } from "@comet/cms-site";
import type { ContentScope, PublicSiteConfig } from "@src/site-configs";
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

export async function getSiteConfigForHost(host: string) {
    const sitePreviewParams = await previewParams({ skipDraftModeCheck: true });
    if (sitePreviewParams?.scope) {
        const siteConfig = getSiteConfigs().find((siteConfig) => siteConfig.scope.domain === sitePreviewParams.scope.domain);
        if (siteConfig) return siteConfig;
    }
    return getSiteConfigs().find((siteConfig) => siteConfig.domains.main === host || siteConfig.domains.preliminary === host);
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
    const host = getHostByHeaders(headers());
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) throw new Error(`SiteConfig not found for host ${host}`);
    return siteConfig;
}

type DomainInfo = {
    domain: string;
    previewData?: SitePreviewData;
};

export async function createEncodedDomain(headers: Headers) {
    const host = getHostByHeaders(headers);
    const sitePreviewParams = await previewParams({ skipDraftModeCheck: true });
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) throw new Error(`SiteConfig not found for host ${host}`);

    const domainInfo: DomainInfo = {
        domain: siteConfig.scope.domain,
        previewData: sitePreviewParams?.previewData,
    };
    return Buffer.from(JSON.stringify(domainInfo)).toString("base64");
}

type DecodedPageProps<T> = T & {
    scope: ContentScope;
    siteConfig: PublicSiteConfig;
    previewData?: SitePreviewData;
    isDraftModeEnabled: boolean;
};

export function decodePageProps<T extends { params: { domain: string; language?: string } }>(props: T): DecodedPageProps<T> {
    const params = props.params;
    const domainInfo = JSON.parse(Buffer.from(decodeURIComponent(params.domain), "base64").toString("utf-8")) as DomainInfo;
    return {
        scope: {
            domain: domainInfo.domain,
            language: params.language || "en",
        },
        ...props,
        params: {
            ...params,
            domain: domainInfo.domain,
        },
        siteConfig: getSiteConfigForDomain(domainInfo.domain),
        isDraftModeEnabled: !!domainInfo.previewData,
        previewData: domainInfo.previewData,
    };
}
