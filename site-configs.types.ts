import type { SiteConfig as SiteConfigLibrary, SiteConfigPrivate, SiteConfigPublic } from "@comet/cli";

export type SiteConfig = SiteConfigLibrary & {
    contentScope: {
        domain: string;
        language: string;
    }
};

export type PrivateSiteConfig = SiteConfigPrivate<SiteConfig>;
export type PublicSiteConfig = SiteConfigPublic<SiteConfig>;
