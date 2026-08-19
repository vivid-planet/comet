import { fileURLToPath } from "node:url";

import { defineConfig } from "oxlint";

// This package can't use `@dextinity/eslint-config`, because that config depends on this package.
const resolveJsPlugin = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

export default defineConfig({
    ignorePatterns: ["lib/**", "bin/**"],
    plugins: ["eslint", "typescript", "import", "unicorn", "oxc"],
    jsPlugins: [
        { name: "unused-imports", specifier: resolveJsPlugin("eslint-plugin-unused-imports") },
        { name: "simple-import-sort", specifier: resolveJsPlugin("eslint-plugin-simple-import-sort") },
    ],
    categories: { correctness: "error" },
    env: { node: true, es2024: true },
    rules: {
        "unused-imports/no-unused-imports": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/no-duplicates": "error",
        "import/newline-after-import": "error",
        "prefer-template": "error",
        "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
        "typescript/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                disallowTypeAnnotations: false,
                fixStyle: "inline-type-imports",
            },
        ],
    },
});
