import type { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "@comet/cli";

export type SiteConfig = BaseSiteConfig & {
    contentScope: {
        domain: string;
        language: string;
    };
};

export type PrivateSiteConfig = ExtractPrivateSiteConfig<SiteConfig>;
export type PublicSiteConfig = ExtractPublicSiteConfig<SiteConfig>;
