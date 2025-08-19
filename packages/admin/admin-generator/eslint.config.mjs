import eslintConfigCore from "@comet/eslint-config/core.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    },
    ...eslintConfigCore,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "no-console": "off",
        },
    },
];

export default config;
