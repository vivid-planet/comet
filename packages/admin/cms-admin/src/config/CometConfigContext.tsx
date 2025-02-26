import { createContext, type PropsWithChildren, useContext } from "react";

import { type BuildInformation } from "../common/header/about/build-information/buildInformation";
import { type ContentLanguageConfig } from "../contentLanguage/contentLanguageConfig";
import { type DamConfig } from "../dam/config/damConfig";
import { type DependenciesConfig } from "../dependencies/dependenciesConfig";
import { type ImgproxyConfig } from "../imgproxy/imgproxyConfig";
import { type PageTreeConfig } from "../pages/pageTreeConfig";
import { type SiteConfigsConfig } from "../siteConfigs/siteConfigsConfig";

export interface CometConfig<SiteConfigs = unknown> {
    apiUrl: string;
    graphQLApiUrl: string;
    adminUrl: string;
    pageTree?: PageTreeConfig;
    dam?: DamConfig;
    imgproxy?: ImgproxyConfig;
    dependencies?: DependenciesConfig;
    siteConfigs?: SiteConfigsConfig<SiteConfigs>;
    buildInformation?: BuildInformation;
    contentLanguage?: ContentLanguageConfig;
}

const CometConfigContext = createContext<CometConfig | undefined>(undefined);

export function CometConfigProvider<SiteConfigs = unknown>({ children, ...config }: PropsWithChildren<CometConfig<SiteConfigs>>) {
    return <CometConfigContext.Provider value={config as CometConfig<unknown>}>{children}</CometConfigContext.Provider>;
}

export function useCometConfig<SiteConfigs = unknown>() {
    const context = useContext(CometConfigContext);

    if (!context) {
        throw new Error(
            "No CometConfigContext instance can be found. Please ensure that you have called `CometConfigProvider` higher up in your tree.",
        );
    }

    return context as CometConfig<SiteConfigs>;
}
