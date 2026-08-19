import { defineConfig } from "oxlint";

import reactConfig from "@dextinity/eslint-config/oxlint/react.js";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/*.generated.ts"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
        "react/jsx-no-literals": "off",
    },
});
