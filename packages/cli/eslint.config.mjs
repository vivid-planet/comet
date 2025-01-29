import eslintConfigReact from "@comet/eslint-config/core.js";

/** @type {import('eslint')} */
const config = [
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
