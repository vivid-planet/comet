import eslintConfigReact from "@comet/eslint-config/future/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    },
    ...eslintConfigReact,
];

export default config;
