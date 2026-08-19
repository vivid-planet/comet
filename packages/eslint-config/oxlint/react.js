import { fileURLToPath } from "node:url";

import coreConfig, { restrictedImportPatterns } from "./core.js";

/**
 * @param {string} specifier
 */
const resolveJsPlugin = (specifier) => fileURLToPath(import.meta.resolve(specifier));

const dextinityAdminImportsRestrictedFromMuiMaterial = ["Alert", "Button", "Dialog", "Tooltip"];

export const restrictedImportPaths = [
    ...dextinityAdminImportsRestrictedFromMuiMaterial.map((name) => ({
        name: "@mui/material",
        importNames: [name],
        message: `Please use ${name} from @dextinity/admin instead`,
    })),
    ...dextinityAdminImportsRestrictedFromMuiMaterial.map((name) => ({
        name: `@mui/material/${name}`,
        message: `Please use ${name} from @dextinity/admin instead`,
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
        message: "Please use @dextinity/admin-icons instead",
    },
    ...["@mui/x-data-grid", "@mui/x-data-grid-pro", "@mui/x-data-grid-premium"].flatMap((name) =>
        ["GridColDef", "GridToolbarQuickFilter"].map((importName) => ({
            name,
            importNames: [importName],
            message: `Please use ${importName} from @dextinity/admin instead`,
        })),
    ),
];

/** @type {import("oxlint").OxlintConfig} */
const config = {
    extends: [coreConfig],
    plugins: ["eslint", "typescript", "import", "unicorn", "oxc", "react"],
    // Oxlint replaces `jsPlugins` instead of merging it, so the plugins of the extended config are repeated.
    jsPlugins: [
        ...coreConfig.jsPlugins,
        { name: "@calm/react-intl", specifier: resolveJsPlugin("@calm/eslint-plugin-react-intl") },
        { name: "formatjs", specifier: resolveJsPlugin("eslint-plugin-formatjs") },
    ],
    env: { node: true, jest: true, browser: true, es2024: true },
    rules: {
        "formatjs/enforce-default-message": ["error", "literal"],
        "formatjs/enforce-placeholders": "error",
        "@calm/react-intl/missing-formatted-message": ["error", { enforceLabels: true }],

        "@dextinity/no-private-sibling-import": "error",

        "react/display-name": "off",
        "react/exhaustive-deps": "error",
        "react/jsx-curly-brace-presence": "error",
        "react/jsx-no-literals": [
            "error",
            {
                allowedStrings: ["…", "€", "$", "?", "–", "—", "/", "(", ")", "%"],
            },
        ],
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "react/rules-of-hooks": "error",
        "react/self-closing-comp": "error",

        "no-restricted-globals": ["error", "React"],
        "no-restricted-imports": [
            "error",
            {
                paths: restrictedImportPaths,
                patterns: restrictedImportPatterns,
            },
        ],
    },
    overrides: [
        {
            // Tests contain plenty of JSX literals that don't need to be translated.
            files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
            rules: {
                "react/jsx-no-literals": "off",
            },
        },
    ],
};

export default config;
