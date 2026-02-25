import { defineConfig, globalIgnores } from "eslint";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores(["lib/**", "src/**/*.generated.ts", "block-meta.json"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
