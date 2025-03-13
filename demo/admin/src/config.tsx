import { createContext, PropsWithChildren, useContext } from "react";

import cometConfig from "./comet-config.json";
import { environment } from "./environment";
import { PublicSiteConfig } from "./site-configs";

export function createConfig() {
    const environmentVariables = {} as Record<(typeof environment)[number], string>;
    for (const variableName of environment) {
        const externalVariableName = `EXTERNAL__${variableName}__`;

        if (externalVariableName in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            environmentVariables[variableName] = (window as any)[externalVariableName];
        } else {
            // eslint-disable-next-line no-console
            console.warn(`External variable ${externalVariableName} not set"`);
        }
    }
    return {
        ...cometConfig,
        apiUrl: `${environmentVariables.ADMIN_URL}/api`,
        adminUrl: environmentVariables.ADMIN_URL,
        sitesConfig: JSON.parse(atob(environmentVariables.PUBLIC_SITE_CONFIGS)) as PublicSiteConfig[],
        buildDate: environmentVariables.BUILD_DATE,
        buildNumber: environmentVariables.BUILD_NUMBER,
        commitSha: environmentVariables.COMMIT_SHA,
    };
}

export type Config = ReturnType<typeof createConfig>;

const ConfigContext = createContext<Config | undefined>(undefined);

export function ConfigProvider({ config, children }: PropsWithChildren<{ config: Config }>) {
    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig(): Config {
    const config = useContext(ConfigContext);

    if (config === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }

    return config;
}
