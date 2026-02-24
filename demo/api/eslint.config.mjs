import eslintConfigNestJs from "@comet/eslint-config/future/nestjs.js";
import storybook from "eslint-plugin-storybook";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";
import { globalIgnores } from "eslint/config";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));
const prettierignorePath = fileURLToPath(new URL(".prettierignore", import.meta.url));

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
    includeIgnoreFile(prettierignorePath, "Imported .prettierignore patterns"),
    globalIgnores(["src/db/migrations/", "src/**/generated/"]),
    ...eslintConfigNestJs,
    ...storybook.configs["flat/recommended"],
];

export default config;
