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
import packageJson from "eslint-plugin-package-json";

/** @type {import('eslint')} */
const config = [
    js.configs.recommended,
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...prettierConfig,
        files: ["*.ts", "*.tsx", "*.json"],
    },
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
            "import/no-duplicates": ["error", { "prefer-inline": true }],
            "import/newline-after-import": "error",
            "import/no-extraneous-dependencies": "error",
        },
    },
    ...eslintPluginJsonc["flat/recommended-with-json"],
    {
        ignores: [
            /**
             * disable package.json and nested package.json files (e.g.in admin -> /server/package.json)
             */
            "**/package.json",
        ],
        rules: {
            "jsonc/sort-keys": "error",
        },
    },
    packageJson.configs.recommended,
    {
        ignores: ["**/*.json"],
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
        rules: {
            "no-unused-vars": "off",
            "prefer-template": "error",
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-return-await": "error",
            "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
            "@typescript-eslint/no-inferrable-types": ["error", { ignoreProperties: true }],
            "@typescript-eslint/prefer-enum-initializers": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    disallowTypeAnnotations: false,
                    fixStyle: "inline-type-imports",
                },
            ],
        },
    },
];

export default config;
