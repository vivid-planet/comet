import { defineConfig } from "oxlint";

import nestJsConfig from "@dextinity/eslint-config/oxlint/nestjs.js";

export default defineConfig({
    extends: [nestJsConfig],
    ignorePatterns: ["src/mikro-orm/migrations/**"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
    },
});
