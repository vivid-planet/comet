import eslintConfigCore from "@comet/eslint-config/core.js";

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
