import { defineConfig, globalIgnores } from "eslint";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores([
        "schema.json",
        "src/fragmentTypes.json",
        "dist/**",
        "src/**/*.generated.ts",
        "src/**/generated/**",
        "block-meta.json",
        "lang/**",
        "lang-compiled/**",
        "lang-extracted/**",
    ]),
    ...eslintConfigReact,
]);
