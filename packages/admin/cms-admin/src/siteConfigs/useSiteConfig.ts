import { type ContentScopeInterface } from "../contentScope/Provider";
import { type SiteConfig } from "./siteConfigsConfig";
import { useSiteConfigs } from "./useSiteConfigs";

export function useSiteConfig({ scope }: { scope: ContentScopeInterface }): SiteConfig {
    const context = useSiteConfigs();
    const siteConfig = context.resolveSiteConfigForScope(context.configs, scope);
    return {
        ...siteConfig,
        blockPreviewBaseUrl: siteConfig.blockPreviewBaseUrl ?? `${siteConfig.url}/block-preview`,
        sitePreviewApiUrl: siteConfig.sitePreviewApiUrl ?? `${siteConfig.url}/api/site-preview`,
    };
}
