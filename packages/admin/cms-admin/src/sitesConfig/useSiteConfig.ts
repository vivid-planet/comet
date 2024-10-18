import { ContentScopeInterface } from "../contentScope/Provider";
import { SiteConfig } from "./SitesConfigContext";
import { useSitesConfig } from "./useSitesConfig";

export function useSiteConfig({ scope }: { scope: ContentScopeInterface }): SiteConfig {
    const context = useSitesConfig();
    const siteConfig = context.resolveSiteConfigForScope(context.configs, scope);
    return {
        ...siteConfig,
        blockPreviewBaseUrl: siteConfig.blockPreviewBaseUrl ?? `${siteConfig.url}/block-preview`,
        sitePreviewApiUrl: siteConfig.sitePreviewApiUrl ?? `${siteConfig.url}/api/site-preview`,
    };
}
