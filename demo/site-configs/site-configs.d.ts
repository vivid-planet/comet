import type { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "@comet/cli";

interface ContentScope {
    domain: string;
    language: string;
}

export interface SiteConfig extends BaseSiteConfig {
    public: {
        scope: {
            domain: string;
            languages: string[];
        };
    };
}

export type PrivateSiteConfig = ExtractPrivateSiteConfig<SiteConfig>;
export type PublicSiteConfig = ExtractPublicSiteConfig<SiteConfig>;
