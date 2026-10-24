import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact from "@dextinity/eslint-config/react.js";

export default defineConfig([
    globalIgnores(["build/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
        },
    },
]);
