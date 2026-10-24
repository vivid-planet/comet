import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigCore from "@dextinity/eslint-config/core.js";

export default defineConfig([
    globalIgnores(["dist/**", ".wrangler/**"]),
    ...eslintConfigCore,
    {
        rules: {
            // Rewrites imports to the @src/ alias, which isn't configured for the ESM build
            "@dextinity/no-other-module-relative-import": "off",
        },
    },
]);
