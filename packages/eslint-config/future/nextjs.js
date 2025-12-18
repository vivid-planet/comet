import nextjsConfig, { restrictedImportPaths as baseRestrictedImportPaths } from "../nextjs.js";

export const restrictedImportPaths = [
    ...baseRestrictedImportPaths,
    {
        name: "node-cache",
        message: "node-cache is abandonware. Use cache-manager or @cacheable/node-cache instead",
    },
];

/** @type {import('eslint')} */
const config = [
    ...nextjsConfig,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: restrictedImportPaths,
                },
            ],
        },
    },
];

export default config;
