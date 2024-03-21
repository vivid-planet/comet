import * as React from "react";

import { ContentScopeInterface } from "../contentScope/Provider";

export interface SiteConfig {
    url: string;
    preloginEnabled: boolean;
    blockPreviewBaseUrl: string;
    sitePreviewApiUrl: string;
}

export interface SiteConfigApi<Configs = unknown> {
    configs: Configs;
    resolveSiteConfigForScope: (configs: Configs, scope: ContentScopeInterface) => SiteConfig;
}

export const SiteConfigContext = React.createContext<SiteConfigApi | undefined>(undefined);
