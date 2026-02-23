import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
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
