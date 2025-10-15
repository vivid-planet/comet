import eslintConfigReact from "@comet/eslint-config/future/react.js";
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import cometPlugin from "@comet/eslint-plugin";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
        },
    },
    {
        plugins: {
            "@comet": cometPlugin,
        },
        rules: {
            "@comet/no-private-sibling-import": ["error", ["gql", "sc", "styles", "generated"]],
        },
    },
    ...storybook.configs["flat/recommended"],
];

export default config;
