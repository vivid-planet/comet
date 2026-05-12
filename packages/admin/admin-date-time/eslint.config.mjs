import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact from "@comet/eslint-config/react.js";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
