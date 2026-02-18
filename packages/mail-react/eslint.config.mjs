import eslintConfigReact from "@comet/eslint-config/future/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["lib/**", "src/**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
