import nestjsConfig from "../nestjs.js";
import { restrictedImportPatterns } from "../core.js";

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
                    patterns: restrictedImportPatterns,
                },
            ],
        },
    },
];

export default config;
