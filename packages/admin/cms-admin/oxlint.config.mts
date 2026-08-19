import { fileURLToPath } from "node:url";

import reactConfig, { restrictedImportPaths } from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

const resolveJsPlugin = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

const dataGridImportRestrictions = ["@mui/x-data-grid", "@mui/x-data-grid-pro", "@mui/x-data-grid-premium"].flatMap((name) =>
    ["DataGrid", "DataGridPro", "DataGridPremium"].map((importName) => ({
        name,
        importNames: [importName],
        message: "Please use DataGrid from `@dextinity/cms-admin` instead, which resolves the configured grid via `DextinityConfig`.",
    })),
);

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/*.generated.ts", "src/**/*.generated.ts"],
    jsPlugins: [...reactConfig.jsPlugins, { name: "storybook", specifier: resolveJsPlugin("eslint-plugin-storybook") }],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "no-restricted-imports": [
            "error",
            {
                paths: [...restrictedImportPaths, ...dataGridImportRestrictions],
            },
        ],
    },
    overrides: [
        {
            files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
            rules: {
                "@calm/react-intl/missing-formatted-message": "off",
                "no-restricted-imports": [
                    "error",
                    {
                        paths: [
                            ...restrictedImportPaths,
                            {
                                name: "@testing-library/react",
                                message: 'Please import from "test-utils" instead.',
                            },
                        ],
                    },
                ],
            },
        },
        {
            // Mirrors `eslint-plugin-storybook`'s `flat/recommended` config, which Oxlint can't consume directly.
            files: ["**/*.stories.{ts,tsx,js,jsx,mjs,cjs}", "**/*.story.{ts,tsx,js,jsx,mjs,cjs}"],
            rules: {
                "react/rules-of-hooks": "off",
                "storybook/await-interactions": "error",
                "storybook/context-in-play-function": "error",
                "storybook/default-exports": "error",
                "storybook/hierarchy-separator": "warn",
                "storybook/no-redundant-story-name": "warn",
                "storybook/no-renderer-packages": "error",
                "storybook/prefer-pascal-case": "warn",
                "storybook/story-exports": "error",
                "storybook/use-storybook-expect": "error",
                "storybook/use-storybook-testing-library": "error",
            },
        },
        {
            files: [".storybook/main.{js,cjs,mjs,ts}"],
            rules: {
                "storybook/no-uninstalled-addons": "error",
            },
        },
        {
            files: ["**/*.stories.ts", "**/*.stories.tsx"],
            rules: {
                "@calm/react-intl/missing-formatted-message": "off",
                "@dextinity/no-other-module-relative-import": "off",
                "no-console": "off",
                "react/jsx-no-literals": "off",
                "react/react-in-jsx-scope": "off",
                "typescript/no-explicit-any": "off",
                "typescript/no-non-null-assertion": "off",
            },
        },
    ],
});
