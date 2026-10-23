import { restrictedImportPatterns } from "@dextinity/eslint-config/core.js";
import eslintConfigReact, { restrictedImportPaths } from "@dextinity/eslint-config/future/react.js";
import { defineConfig, globalIgnores } from "eslint/config";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
    globalIgnores(["lib/**", "storybook-static/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
            "@dextinity/no-private-sibling-import": ["error", ["gql", "sc", "module.css"]],
            "no-restricted-imports": [
                "error",
                {
                    paths: restrictedImportPaths,
                    patterns: [
                        ...restrictedImportPatterns,
                        {
                            group: ["@mui/*", "@emotion/*", "@dextinity/admin*", "react-intl"],
                            message: "@dextinity/ui stays independent of the admin's MUI, Emotion and i18n stack, so it works in the site too.",
                        },
                    ],
                },
            ],
        },
    },
    ...storybook.configs["flat/recommended"],
    {
        files: ["src/**/*.stories.tsx", "src/**/*.test.ts", "src/**/*.test.tsx", "src/storybook/**", ".storybook/**"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "react/jsx-no-literals": "off",
        },
    },
]);
