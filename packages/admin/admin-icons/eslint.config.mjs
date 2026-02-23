import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigReact from "@comet/eslint-config/future/react.js";
import path from "node:path";

/** @type {import('eslint')} */
const config = [
    includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
    {
        ignores: ["src/*.generated.ts", "lib/**"],
    },
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "react/jsx-no-literals": "off"
        },
    },
];

export default config;
