import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigCore from "@dextinity/eslint-config/core.js";

export default defineConfig([
    globalIgnores(["lib/**"]),
    ...eslintConfigCore,
    {
        rules: {
            // Rewrites imports to the @src/ alias, which tsc doesn't resolve in the ESM output
            "@dextinity/no-other-module-relative-import": "off",
        },
    },
]);
