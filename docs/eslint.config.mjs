import eslintConfigReact from "@dextinity/eslint-config/future/react.js";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([".docusaurus", "build"]),
    ...eslintConfigReact,
    {
        rules: {
            "no-restricted-syntax": "off",
            "react/jsx-no-literals": "off",
        },
    },
]);
