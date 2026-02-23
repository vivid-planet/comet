import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigNestJs from "@comet/eslint-config/future/nestjs.js";
import path from "node:path";
import storybook from "eslint-plugin-storybook";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated/**", "block-meta.json"],
    },
    ...eslintConfigNestJs,
    ...storybook.configs["flat/recommended"],
];

export default config;
