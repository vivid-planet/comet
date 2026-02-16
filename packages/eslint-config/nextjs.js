import coreConfig, { restrictedImportPatterns } from "./core.js";
import react from "eslint-plugin-react";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";

export const restrictedImportPaths = [
    {
        name: "react",
        importNames: ["default"],
    },
    {
        name: "next/image",
        importNames: ["default"],
        message: "Don't use next/image. See https://docs.comet-dxp.com/docs/faqs/next-image-import-restriction",
    },
];

/** @type {import('eslint')} */
const config = [
    ...coreConfig,
    // Extend config from plugin instead of using eslint-config-next to prevent issues with duplicate plugins, e.g., import.
    // See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config.
    nextPlugin.configs["core-web-vitals"],
    {
        rules: {
            "@comet/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],
            "no-restricted-globals": ["error", "React"],
            "no-restricted-imports": [
                "error",
                {
                    paths: restrictedImportPaths,
                    patterns: restrictedImportPatterns,
                },
            ],
        },
    },
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            react: react,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/display-name": "off",
            "react/jsx-curly-brace-presence": "error",
            "react/prop-types": "off",
            "react/self-closing-comp": "error",
            "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
            "react/react-in-jsx-scope": "off",
            "@next/next/no-img-element": "off",
        },
    },
];

export default config;
