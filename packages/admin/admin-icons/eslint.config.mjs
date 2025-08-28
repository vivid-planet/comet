import eslintConfigReact from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "react/jsx-no-literals": "off"
        },
    },
];

export default config;
