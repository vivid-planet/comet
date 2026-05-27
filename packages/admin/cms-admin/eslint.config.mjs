import eslintConfigReact, { restrictedImportPaths } from "@comet/eslint-config/future/react.js";
import { defineConfig, globalIgnores } from "eslint/config";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"]),
    ...eslintConfigReact,
    {
        // These files interpolate JS expressions into `gql` templates, which `@graphql-eslint/eslint-plugin` cannot parse.
        files: [
            "src/dependencies/createDependencyMethods.ts",
            "src/dependencies/createDocumentDependencyMethods.ts",
            "src/form/queryUpdatedAt.tsx",
        ],
        processor: {
            meta: { name: "no-op" },
            preprocess: (code) => [code],
            postprocess: (messages) => messages.flat(),
            supportsAutofix: true,
        },
    },
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        ...restrictedImportPaths,
                        {
                            name: "@testing-library/react",
                            message: 'Please import from "test-utils" instead.',
                        },
                    ],
                },
            ],
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
]);
