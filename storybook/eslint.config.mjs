import eslintConfigReact from "@comet/eslint-config/future/react.js";
import storybook from "eslint-plugin-storybook";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "storybook-static/**"],
    },
    ...eslintConfigReact,
    ...storybook.configs["flat/recommended"],
    {
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "no-console": "off",
            "@comet/no-other-module-relative-import": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-no-literals": "off",
        },
    },
];

export default config;
