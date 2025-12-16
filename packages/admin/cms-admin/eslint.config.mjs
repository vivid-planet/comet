import eslintConfigReact, { restrictedImportPaths } from "@comet/eslint-config/future/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigReact,
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
];

export default config;
