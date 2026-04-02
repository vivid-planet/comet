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
            "import/order": "off",
            "no-console": "off",
            "no-duplicate-imports": "error",
            "sort-imports": "off",
        },
    },
];

export default config;
