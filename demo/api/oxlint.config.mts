import { fileURLToPath } from "node:url";

import nestJsConfig from "@dextinity/eslint-config/oxlint/nestjs.js";
import { defineConfig } from "oxlint";

const resolveJsPlugin = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

export default defineConfig({
    extends: [nestJsConfig],
    ignorePatterns: ["src/db/migrations/**", "src/**/*.generated.ts", "src/**/generated/**"],
    jsPlugins: [...nestJsConfig.jsPlugins, { name: "storybook", specifier: resolveJsPlugin("eslint-plugin-storybook") }],
    overrides: [
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
    ],
});
