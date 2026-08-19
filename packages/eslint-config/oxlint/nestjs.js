import coreConfig, { restrictedImportPatterns } from "./core.js";

export const restrictedImportPaths = [
    {
        name: "node-cache",
        message: "node-cache is abandonware. Use @nestjs/cache-manager instead",
    },
];

/** @type {import("oxlint").OxlintConfig} */
const config = {
    extends: [coreConfig],
    // Oxlint replaces `jsPlugins` instead of merging it, so the plugins of the extended config are repeated.
    jsPlugins: coreConfig.jsPlugins,
    rules: {
        // Oxlint can't tell whether an import is only used as a type inside a decorated declaration. TypeScript emits
        // those types as runtime metadata when `emitDecoratorMetadata` is enabled, so turning them into type imports
        // would break NestJS' dependency injection.
        "typescript/consistent-type-imports": "off",

        "no-console": "off",
        "no-duplicate-imports": "error",
        "no-restricted-imports": [
            "error",
            {
                paths: restrictedImportPaths,
                patterns: restrictedImportPatterns,
            },
        ],
    },
};

export default config;
