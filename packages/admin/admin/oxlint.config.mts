import { fileURLToPath } from "node:url";

import reactConfig, { restrictedImportPaths } from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

const resolveJsPlugin = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/*.generated.ts"],
    jsPlugins: [...reactConfig.jsPlugins, { name: "storybook", specifier: resolveJsPlugin("eslint-plugin-storybook") }],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "@dextinity/no-private-sibling-import": ["error", ["gql", "sc", "styles", "generated"]],
        "typescript/no-explicit-any": "off",
        "typescript/no-non-null-assertion": "off",
    },
    overrides: [
        {
            files: ["**/*.test.ts", "**/*.test.tsx"],
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
                "no-console": "off",
                "react/jsx-no-literals": "off",
                "react/react-in-jsx-scope": "off",
            },
        },
    ],
});
