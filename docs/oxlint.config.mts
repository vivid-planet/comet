import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: [".docusaurus/**", "build/**"],
    rules: {
        "@calm/react-intl/missing-formatted-message": "off",
        "react/jsx-no-literals": "off",
    },
});
