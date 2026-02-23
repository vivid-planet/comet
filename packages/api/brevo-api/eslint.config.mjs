import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigNestJs from "@comet/eslint-config/nestjs.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "block-meta.json"],
    },
    ...eslintConfigNestJs,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
];

export default config;
