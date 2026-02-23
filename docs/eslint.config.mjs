import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigReact from "@comet/eslint-config/future/react.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: [".docusaurus", "build"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "react/jsx-no-literals": "off",
        },
    },
];

export default config;
