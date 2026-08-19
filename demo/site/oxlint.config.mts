import nextJsConfig from "@dextinity/eslint-config/oxlint/nextjs.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [nextJsConfig],
    ignorePatterns: ["src/**/*.generated.ts"],
    jsPlugins: [...nextJsConfig.jsPlugins, { name: "process-env", specifier: "./oxlint-plugins/process-env.mjs" }],
    rules: {
        "process-env/no-next-public-env": "error",
    },
    overrides: [
        {
            files: ["next.config.*"],
            rules: {
                "process-env/no-process-env": "error",
            },
        },
    ],
});
