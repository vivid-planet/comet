import cometConfig from "./comet-config.json";
import { environment } from "./environment";
import { type PublicSiteConfig } from "./site-configs";

export function createConfig() {
    const environmentVariables = {} as Record<(typeof environment)[number], string>;
    for (const variableName of environment) {
        const externalVariableName = `EXTERNAL__${variableName}__`;

        if (externalVariableName in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            environmentVariables[variableName] = (window as any)[externalVariableName];
        } else {
            console.warn(`External variable ${externalVariableName} not set"`);
        }
    }
    return {
        ...cometConfig,
        apiUrl: environmentVariables.API_URL,
        adminUrl: environmentVariables.ADMIN_URL,
        siteConfigs: JSON.parse(atob(environmentVariables.PUBLIC_SITE_CONFIGS)) as PublicSiteConfig[],
        buildDate: environmentVariables.BUILD_DATE,
        buildNumber: environmentVariables.BUILD_NUMBER,
        commitSha: environmentVariables.COMMIT_SHA,
        muiLicenseKey: environmentVariables.MUI_LICENSE_KEY,
    };
}
