import eslintConfigReact from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigReact,
    {
        files: ["src/**/*.spec.ts", "src/**/*.spec.tsx", "src/**/*.test.ts", "src/**/*.test.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "@comet/no-jsx-string-literals": "off",
        },
    },
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
