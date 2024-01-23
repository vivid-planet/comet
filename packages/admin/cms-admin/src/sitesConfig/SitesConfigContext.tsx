import * as React from "react";

import { ContentScopeInterface } from "../contentScope/Provider";

export interface SiteConfig {
    url: string;
    previewUrl: string;
    preloginEnabled: boolean;
}

export interface SiteConfigApi<Configs = unknown> {
    configs: Configs;
    resolveSiteConfigForScope: (configs: Configs, scope: ContentScopeInterface) => SiteConfig;
}

export const SiteConfigContext = React.createContext<SiteConfigApi | undefined>(undefined);
