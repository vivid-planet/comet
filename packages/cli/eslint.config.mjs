import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigCore from "@comet/eslint-config/core.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    ...eslintConfigCore,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
