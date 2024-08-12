import type { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "@comet/cli";

interface ContentScope {
    domain: string;
    language: string;
}

export type SiteConfig = BaseSiteConfig;

export type PrivateSiteConfig = ExtractPrivateSiteConfig<SiteConfig> & {
    public: {
        contentScope: ContentScope;
    };
};
export type PublicSiteConfig = ExtractPublicSiteConfig<SiteConfig> & {
    public: {
        contentScope: ContentScope;
    };
};
