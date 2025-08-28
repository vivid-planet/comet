import { createContext, type PropsWithChildren, useContext } from "react";

import { type BlocksConfig, BlocksConfigProvider } from "../blocks/config/BlocksConfigContext";
import { type BlockContext } from "../blocks/context/BlockContext";
import { BlockContextProvider } from "../blocks/context/BlockContextProvider";
import { type BuildInformation } from "../common/header/about/build-information/buildInformation";
import { type ContentLanguageConfig } from "../contentLanguage/contentLanguageConfig";
import { type DamConfig } from "../dam/config/damConfig";
import { type DependenciesConfig } from "../dependencies/dependenciesConfig";
import { type PageTreeConfig } from "../pages/pageTreeConfig";
import { type RedirectsConfig } from "../redirects/redirectsConfig";
import { type SiteConfigsConfig } from "../siteConfigs/siteConfigsConfig";
import { type WarningsConfig } from "../warnings/warningsConfig";

export interface CometConfig<SiteConfigs = unknown> {
    apiUrl: string;
    graphQLApiUrl: string;
    adminUrl: string;
    pageTree?: PageTreeConfig;
    dam?: DamConfig;
    redirects?: RedirectsConfig;
    dependencies?: DependenciesConfig;
    siteConfigs?: SiteConfigsConfig<SiteConfigs>;
    buildInformation?: BuildInformation;
    contentLanguage?: ContentLanguageConfig;
    blocks?: BlocksConfig & {
        context?: Omit<BlockContext, "apiUrl" | "apolloClient">;
    };
    warnings?: WarningsConfig;
}

const CometConfigContext = createContext<CometConfig | undefined>(undefined);

export function CometConfigProvider<SiteConfigs = unknown>({ children, ...config }: PropsWithChildren<CometConfig<SiteConfigs>>) {
    const { context: blockContext = {}, ...blocksConfig } = config.blocks ?? {};

    return (
        <CometConfigContext.Provider value={config as CometConfig<unknown>}>
            <BlockContextProvider value={blockContext}>
                <BlocksConfigProvider {...blocksConfig}>{children}</BlocksConfigProvider>
            </BlockContextProvider>
        </CometConfigContext.Provider>
    );
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
