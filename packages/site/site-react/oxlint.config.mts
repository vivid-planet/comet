import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/*.generated.ts", "src/**/*.generated.ts"],
    rules: {
        "@dextinity/no-other-module-relative-import": "off",
    },
});
