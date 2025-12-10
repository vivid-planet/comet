import eslintConfigReact from "@comet/eslint-config/future/react.js";
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import cometPlugin from "@comet/eslint-plugin";

const importedObjectWithNoRestrictedImports = eslintConfigReact.find((config) => config.rules?.["no-restricted-imports"]);
const [importedNoRestrictedImportsType, importedNoRestrictedImportsPathsObject] =
    importedObjectWithNoRestrictedImports.rules["no-restricted-imports"];

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
            "no-restricted-imports": [
                importedNoRestrictedImportsType,
                {
                    ...importedNoRestrictedImportsPathsObject,
                    paths: [
                        ...importedNoRestrictedImportsPathsObject.paths,
                        {
                            name: "@testing-library/react",
                            message: 'Please import from "test-utils" instead.',
                        },
                    ],
                },
            ],
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
    {
        files: ["**/*.stories.ts", "**/*.stories.tsx"],
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
