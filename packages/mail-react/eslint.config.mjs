import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigReact, { restrictedImportPaths } from "@comet/eslint-config/future/react.js";
import { restrictedImportPatterns } from "@comet/eslint-config/core.js";

export default defineConfig([
    globalIgnores(["lib/**", "src/**/*.generated.ts", "block-meta.json"]),
    ...eslintConfigReact,
    {
        rules: {
            "@comet/no-other-module-relative-import": "off",
        },
    },
    {
        files: ["src/storybook-manager/**", "src/storybook-preview/**", "src/**/*.stories.tsx", "src/**/*.test.ts", "src/**/*.test.tsx"],
        rules: {
            "@calm/react-intl/missing-formatted-message": "off",
            "react/jsx-no-literals": "off",
        },
    },
    {
        files: ["src/storybook-manager/**"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: restrictedImportPaths.filter((entry) => entry.name !== "react" || !entry.importNames?.includes("default")),
                    patterns: restrictedImportPatterns,
                },
            ],
        },
    },
]);
