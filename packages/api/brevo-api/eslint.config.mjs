import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigNestJs from "@comet/eslint-config/nestjs.js";

export default defineConfig([
    globalIgnores(["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "lib/**", "block-meta.json"]),
    ...eslintConfigNestJs,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
