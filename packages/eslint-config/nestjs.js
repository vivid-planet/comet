import coreConfig from "./core.js";
import globals from "globals";

/** @type {import('eslint')} */
const config = [
    ...coreConfig,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: ["**/*.spec.ts", "**/*.test.ts", "**/jest.config.*", "**/jest-setup-file.ts"],
                },
            ],
            "import/order": "off",
            "no-console": "off",
            "no-duplicate-imports": "error",
            "sort-imports": "off",
        },
    },
];

export default config;
