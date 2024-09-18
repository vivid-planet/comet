import { BaseCometConfig, CometConfig, SiteConfig } from "@comet/cms-admin";

declare module "@comet/cms-admin" {
    interface CometConfig extends BaseCometConfig {
        sitesConfig: SitesConfig;
    }
}

import cometConfig from "./comet-config.json";
import { environment } from "./environment";

export function createConfig(): CometConfig {
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
        apiUrl: environmentVariables.API_URL,
        adminUrl: environmentVariables.ADMIN_URL,
        sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
    };
}

export type SitesConfig = Record<string, SiteConfig>;
