import nestjsConfig from "../nestjs.js";

export const restrictedImportPaths = [
    {
        name: "node-cache",
        message: "node-cache is abandonware. Use @nestjs/cache-manager instead",
    },
];

/** @type {import('eslint')} */
const config = [
    ...nestjsConfig,
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
