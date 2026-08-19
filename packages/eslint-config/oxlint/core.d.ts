import type { OxlintConfig } from "oxlint";

/**
 * A config that always has `jsPlugins`, because Oxlint replaces the field instead of merging it: a config extending
 * this one has to repeat its JS plugins.
 */
export type DextinityOxlintConfig = OxlintConfig & { jsPlugins: NonNullable<OxlintConfig["jsPlugins"]> };

export type RestrictedImportPattern = {
    group: string[];
    message?: string;
};

export type RestrictedImportPath = {
    name: string;
    importNames?: string[];
    message?: string;
};

export declare const restrictedImportPatterns: RestrictedImportPattern[];

declare const config: DextinityOxlintConfig;

export default config;
