import { defineConfig } from "eslint/config";
import eslintConfigCore from "@comet/eslint-config/core.js";

export default defineConfig([
    ...eslintConfigCore,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "no-console": "off",
        },
    },
]);
