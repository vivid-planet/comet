import eslintConfigCore from "@comet/eslint-config/core.js";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint')} */
const config = [
    ...eslintConfigCore,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
