import { defineConfig, globalIgnores } from "eslint";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
        },
    },
]);
