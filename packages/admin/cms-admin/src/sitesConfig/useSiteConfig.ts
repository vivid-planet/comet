import { ContentScopeInterface } from "../contentScope/Provider";
import { SiteConfig } from "./SitesConfigContext";
import { useSitesConfig } from "./useSitesConfig";

export function useSiteConfig({ scope }: { scope: ContentScopeInterface }): SiteConfig {
    const context = useSitesConfig();
    return context.resolveSiteConfigForScope(context.configs, scope);
}
