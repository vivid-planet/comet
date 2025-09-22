import eslintConfigCore from "@comet/eslint-config/core.js";
import storybook from "eslint-plugin-storybook";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    },
    ...eslintConfigCore,
    ...storybook.configs["flat/recommended"],
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "no-console": "off",
        },
    },
];

export default config;
