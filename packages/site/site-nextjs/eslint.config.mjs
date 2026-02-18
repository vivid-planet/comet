import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigNextJs,
    {
        rules: {
            "@next/next/no-html-link-for-pages": "off", // disabled because lib has no pages dir
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        ignores: ["*.json"],
        rules: {
            "@typescript-eslint/consistent-type-exports": [
                "error",
                {
                    fixMixedExportsWithInlineTypeSpecifier: true,
                },
            ],
        },
    },
];

export default config;
