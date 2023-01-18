import cometConfig from "../comet-config.json";
import environment from "./environment";

const environmentVariables = {} as Record<typeof environment[number], string>;
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

export const config = {
    ...cometConfig,
    apiUrl: environmentVariables.API_URL,
    adminUrl: environmentVariables.ADMIN_URL,
    sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG),
    buildDate: environmentVariables.BUILD_DATE,
    buildNumber: environmentVariables.BUILD_NUMBER,
    commitSha: environmentVariables.COMMIT_SHA,
};

export type Config = typeof config;
