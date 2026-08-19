import { fileURLToPath } from "node:url";

import { defineConfig } from "oxlint";

// This package can't use its own config, because that would require it to be resolvable under its own package name.
const resolveJsPlugin = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

export default defineConfig({
    plugins: ["eslint", "typescript", "import", "unicorn", "oxc"],
    jsPlugins: [
        { name: "simple-import-sort", specifier: resolveJsPlugin("eslint-plugin-simple-import-sort") },
        { name: "unused-imports", specifier: resolveJsPlugin("eslint-plugin-unused-imports") },
    ],
    categories: { correctness: "error" },
    env: { node: true, es2024: true },
    rules: {
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
        "unused-imports/no-unused-imports": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
        "prefer-template": "error",
    },
});
