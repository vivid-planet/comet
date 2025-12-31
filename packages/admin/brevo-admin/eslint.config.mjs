import eslintConfigReact from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts", "lib/**", "**/*.generated.ts"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
