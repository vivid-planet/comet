import { defineConfig } from "oxlint";

import coreConfig from "@dextinity/eslint-config/oxlint/core.js";

export default defineConfig({
    extends: [coreConfig],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
    },
});
