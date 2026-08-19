import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/**/*.generated.ts", "src/**/generated/**", "src/fragmentTypes.json"],
});
