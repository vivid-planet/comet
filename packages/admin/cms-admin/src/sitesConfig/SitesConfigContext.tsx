import * as React from "react";

import { ContentScopeInterface } from "../contentScope/Provider";

export interface SiteConfig {
    url: string;
    preloginEnabled: boolean;
}

export interface SiteConfigApi<Configs = unknown> {
    configs: Configs;
    resolveSiteConfigForScope: (configs: Configs, scope: ContentScopeInterface) => SiteConfig;
    blockPreviewApiUrl: string;
    sitePreviewApiUrl: string;
}

export const SiteConfigContext = React.createContext<SiteConfigApi | undefined>(undefined);
