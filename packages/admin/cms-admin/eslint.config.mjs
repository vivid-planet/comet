import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigReact from "@comet/eslint-config/future/react.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["lib/**", "**/*.generated.ts"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
        },
    },
];

export default config;
