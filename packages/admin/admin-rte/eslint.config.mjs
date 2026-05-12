import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
