import { defineConfig, globalIgnores } from "eslint";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
            "react/jsx-no-literals": "off"
        },
    },
]);
