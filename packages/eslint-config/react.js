import coreConfig from "./core.js";
import reactIntlFormatPlugin from "@calm/eslint-plugin-react-intl";
import globals from "globals";
import formatJs from "eslint-plugin-formatjs";
import react from "eslint-plugin-react";
import cometPlugin from "@comet/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint')} */
const config = [
    ...coreConfig,
    {
        plugins: {
            "@calm/react-intl": reactIntlFormatPlugin,
        },
    },
    {
        plugins: {
            formatjs: formatJs,
        },
        rules: {
            "formatjs/enforce-default-message": "error",
            "formatjs/enforce-placeholders": "error",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": ["error", { enforceLabels: true }],
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "error",
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
        rules: {
            "react/self-closing-comp": "error",
            "react/display-name": "off",
            "react/prop-types": "off",
            "react/jsx-curly-brace-presence": "error",
            "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
            "no-restricted-globals": ["error", "React"],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react",
                            importNames: ["default"],
                        },
                        {
                            name: "@mui/material",
                            importNames: ["styled"],
                            message: "Please use styled from @mui/material/styles instead.",
                        },
                        {
                            name: "@mui/icons-material",
                            message: "Please use @comet/admin-icons instead",
                        },
                        {
                            name: "@mui/material",
                            importNames: ["Alert"],
                            message: "Please use Alert from @comet/admin instead",
                        },
                        {
                            name: "@mui/material",
                            importNames: ["Button"],
                            message: "Please use Button from @comet/admin instead",
                        },
                        {
                            name: "@mui/material",
                            importNames: ["Dialog"],
                            message: "Please use Dialog from @comet/admin instead",
                        },
                        {
                            name: "@mui/x-data-grid",
                            importNames: ["GridColDef"],
                            message: "Please use GridColDef from @comet/admin instead",
                        },
                        {
                            name: "@mui/x-data-grid-pro",
                            importNames: ["GridColDef"],
                            message: "Please use GridColDef from @comet/admin instead",
                        },
                        {
                            name: "@mui/x-data-grid-premium",
                            importNames: ["GridColDef"],
                            message: "Please use GridColDef from @comet/admin instead",
                        },
                        {
                            name: "@mui/material",
                            importNames: ["Tooltip"],
                            message: "Please use Tooltip from @comet/admin instead",
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "react/jsx-no-literals": "error",
        },
    },
    {
        plugins: {
            "@comet": cometPlugin,
        },
        rules: {
            "@comet/no-private-sibling-import": "error",
        },
    },
];

export default config;
