import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { configs as eslintPluginJsonc } from "eslint-plugin-jsonc";
import cometPlugin from "@comet/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";

/** @type {import('eslint')} */
const config = [
    js.configs.recommended,
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
            "@comet": cometPlugin,
        },
        rules: {
            "@comet/no-other-module-relative-import": ["warn"],
        },
    },
    {
        ...importPlugin.flatConfigs.recommended,
        rules: {
            "import/no-duplicates": "error",
            "import/newline-after-import": "error",
            "import/no-extraneous-dependencies": "error",
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
            "no-unused-vars": "off",
            "prefer-template": "error",
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-return-await": "error",
            "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
            "@typescript-eslint/no-inferrable-types": ["error", { ignoreProperties: true }],
            "@typescript-eslint/prefer-enum-initializers": "error",
        },
    },
    /* order matters -> json rules must be after typescript rules */
    ...eslintPluginJsonc["flat/recommended-with-json"],
    {
        rules: {
            "jsonc/sort-keys": "error",
        },
    },
];

export default config;
