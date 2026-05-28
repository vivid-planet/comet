import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact from "@comet/eslint-config/future/react.js";

export default defineConfig([
    globalIgnores(["src/*.generated.ts", "lib/**", "**/*.generated.ts", "block-meta.json"]),
    ...eslintConfigReact,
    {
        // This file interpolates a JS expression into a `gql` template, which `@graphql-eslint/eslint-plugin` cannot parse.
        files: ["src/targetGroups/TargetGroupForm.tsx"],
        processor: {
            meta: { name: "no-op" },
            preprocess: (code) => [code],
            postprocess: (messages) => messages.flat(),
            supportsAutofix: true,
        },
    },
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
]);
