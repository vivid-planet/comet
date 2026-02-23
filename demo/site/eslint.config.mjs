import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", ".next/**", "public/**", "block-meta.json"],
    },
    ...eslintConfigNextJs,
];

export default config;
