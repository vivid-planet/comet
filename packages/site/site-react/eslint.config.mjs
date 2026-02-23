import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigReact from "@comet/eslint-config/future/react.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["src/*.generated.ts", "**/*.generated.ts"],
    },
    ...eslintConfigReact,
    {
        rules: {
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
