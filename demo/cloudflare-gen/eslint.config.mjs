import { defineConfig, globalIgnores } from "eslint/config";
import { restrictedImportPatterns } from "@dextinity/eslint-config/core.js";
import eslintConfigReact, { restrictedImportPaths } from "@dextinity/eslint-config/react.js";

/** The admin (src/) and the API (api/) run in different environments and are bundled separately, so neither imports the other. */
const importBoundaries = {
    "src/**": [
        { group: ["**/api", "**/api/**"], message: "The admin doesn't import the API. Use the typed clients of the feature packages." },
        { group: ["@dextinity/*/server"], allowTypeImports: true, message: "Server code doesn't run in the admin, only its types may be imported." },
    ],
    "api/**": [
        { group: ["**/src", "**/src/**"], message: "The API doesn't import the admin." },
        { group: ["@dextinity/*/client", "@dextinity/*/vite"], message: "Client and dev server code doesn't run in the Worker." },
    ],
};

export default defineConfig([
    globalIgnores(["dist/**", ".wrangler/**", "migrations/**"]),
    ...eslintConfigReact,
    {
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
        },
    },
    ...Object.entries(importBoundaries).map(([files, patterns]) => ({
        files: [files],
        rules: {
            "no-restricted-imports": ["error", { paths: restrictedImportPaths, patterns: [...restrictedImportPatterns, ...patterns] }],
        },
    })),
]);
