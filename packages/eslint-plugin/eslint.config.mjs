import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import json from "@eslint/json";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["lib/**/*", "bin/**/*"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    prettierPlugin,
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        plugins: {
            json,
        },
        files: ["**/*.json"],
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
            "no-irregular-whitespace": "off",
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        // Rules
        rules: {
            "prefer-template": "error",
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-return-await": "error",
        },
    },
];

export default config;
