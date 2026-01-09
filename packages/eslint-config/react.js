import coreConfig from "./core.js";
import reactIntlFormatPlugin from "@calm/eslint-plugin-react-intl";
import globals from "globals";
import formatJs from "eslint-plugin-formatjs";
import react from "eslint-plugin-react";
import cometPlugin from "@comet/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

const cometAdminImportsRestrictedFromMuiMaterial = ["Alert", "Button", "Dialog", "Tooltip"];

export const restrictedImportPaths = [
    ...cometAdminImportsRestrictedFromMuiMaterial.map((name) => ({
        name: "@mui/material",
        importNames: [name],
        message: `Please use ${name} from @comet/admin instead`,
    })),
    ...cometAdminImportsRestrictedFromMuiMaterial.map((name) => ({
        name: `@mui/material/${name}`,
        message: `Please use ${name} from @comet/admin instead`,
    })),
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
];

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
        settings: {
            react: {
                version: "detect",
            },
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
                    paths: restrictedImportPaths,
                },
            ],
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
