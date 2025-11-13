import coreConfig from "./core.js";
import react from "eslint-plugin-react";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

const nextCoreWebVitals = compat
    .config({
        extends: ["next/core-web-vitals"],
    })
    // We need to filter out configurations from nextCoreWebVitals which define plugin.import. It is conflicting
    // because it gets redefined
    .filter((config) => !config.plugins || !config.plugins.import);

/** @type {import('eslint')} */
const config = [
    ...coreConfig,
    // Next.js does not support ESLint v9 flat config yet - an opt-in to compatibility mode is required
    ...nextCoreWebVitals,
    {
        rules: {
            "@comet/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],
            "no-restricted-globals": ["error", "React"],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react",
                            importNames: ["default"],
                        },
                        {
                            name: "next/image",
                            importNames: ["default"],
                            message: "Please use Image from @comet/site-nextjs instead",
                        },
                    ],
                },
            ],
        },
    },
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            react: react,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/display-name": "off",
            "react/jsx-curly-brace-presence": "error",
            "react/prop-types": "off",
            "react/self-closing-comp": "error",
            "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
            "react/react-in-jsx-scope": "off",
            "@next/next/no-img-element": "off",
        },
    },
];

export default config;
