import { defineConfig, globalIgnores } from "eslint";
import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";

export default defineConfig([
    globalIgnores([
        "**/**/*.generated.ts",
        "dist/**",
        "lang/**",
        "lang-compiled/**",
        "lang-extracted/**",
        ".next/**",
        "public/**",
        "block-meta.json",
        "lang/**",
        "lang-compiled/**",
        "lang-extracted/**",
    ]),
    ...eslintConfigNextJs,
]);
