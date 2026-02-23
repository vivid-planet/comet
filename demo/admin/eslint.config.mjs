import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigReact from "@comet/eslint-config/future/react.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["dist/**", "src/**/generated/**"],
    },
    ...eslintConfigReact,
];

export default config;
