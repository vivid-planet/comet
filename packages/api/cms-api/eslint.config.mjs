import { defineConfig, globalIgnores } from "eslint";
import eslintConfigReact from "@comet/eslint-config/future/nestjs.js";

export default defineConfig([
    globalIgnores(["src/mikro-orm/migrations/**", "lib/**", "block-meta.json"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
