import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/**/*.generated.ts"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
    },
    overrides: [
        {
            files: ["src/**/*.stories.tsx", "src/**/*.test.ts", "src/**/*.test.tsx", "src/storybook/**"],
            rules: {
                "@calm/react-intl/missing-formatted-message": "off",
                "react/jsx-no-literals": "off",
            },
        },
        {
            files: ["src/storybook/**"],
            rules: {
                "no-restricted-imports": "off",
            },
        },
    ],
});
