import { defineConfig } from "oxlint";

import nextJsConfig from "@dextinity/eslint-config/oxlint/nextjs.js";

export default defineConfig({
    extends: [nextJsConfig],
    ignorePatterns: ["src/**/*.generated.ts"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "nextjs/no-html-link-for-pages": "off", // disabled because lib has no pages dir
    },
});
