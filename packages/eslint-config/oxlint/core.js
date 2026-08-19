import { fileURLToPath } from "node:url";

/**
 * Resolves a JS plugin to an absolute path, so that the plugins of this package don't have to be resolvable from the
 * consuming project.
 *
 * @param {string} specifier
 */
const resolveJsPlugin = (specifier) => fileURLToPath(import.meta.resolve(specifier));

export const restrictedImportPatterns = [
    {
        group: ["@dextinity/*/lib", "@dextinity/*/lib/**"],
        message: "Don't import private files from @dextinity packages via /lib. Use the package root instead.",
    },
];

/**
 * The rules Oxlint implements natively are used through its built-in plugins. Rules without a native equivalent come
 * from ESLint plugins, which Oxlint runs as JS plugins.
 *
 * Code formatting isn't part of linting anymore, it's handled by Oxfmt.
 *
 * @type {import("oxlint").OxlintConfig}
 */
const config = {
    // `unicorn` and `oxc` are Oxlint's own plugins, they are enabled by default.
    plugins: ["eslint", "typescript", "import", "unicorn", "oxc"],
    jsPlugins: [
        { name: "@dextinity", specifier: resolveJsPlugin("@dextinity/eslint-plugin") },
        { name: "simple-import-sort", specifier: resolveJsPlugin("eslint-plugin-simple-import-sort") },
        { name: "unused-imports", specifier: resolveJsPlugin("eslint-plugin-unused-imports") },
    ],
    categories: { correctness: "error" },
    env: { node: true, jest: true, es2024: true },
    rules: {
        "@dextinity/graphql-naming-convention": "error",
        "@dextinity/no-other-module-relative-import": "warn",

        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
        "unused-imports/no-unused-imports": "error",

        "import/newline-after-import": "error",
        "import/no-duplicates": ["error", { preferInline: true }],

        curly: "error",
        "no-console": ["error", { allow: ["warn", "error", "info", "debug"] }],
        "no-restricted-imports": ["error", { patterns: restrictedImportPatterns }],
        "no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
        "prefer-template": "error",

        "typescript/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                disallowTypeAnnotations: false,
                fixStyle: "inline-type-imports",
            },
        ],
        "typescript/no-import-type-side-effects": "error",
        "typescript/no-inferrable-types": ["error", { ignoreProperties: true }],
        "typescript/no-non-null-assertion": "error",
        "typescript/prefer-enum-initializers": "error",

        // The rules of typescript-eslint's `recommended` config that aren't in Oxlint's `correctness` category.
        "no-array-constructor": "error",
        "no-unused-expressions": "error",
        "typescript/ban-ts-comment": "error",
        "typescript/no-duplicate-enum-values": "error",
        "typescript/no-empty-object-type": "error",
        "typescript/no-explicit-any": "error",
        "typescript/no-extra-non-null-assertion": "error",
        "typescript/no-misused-new": "error",
        "typescript/no-namespace": "error",
        "typescript/no-non-null-asserted-optional-chain": "error",
        "typescript/no-require-imports": "error",
        "typescript/no-this-alias": "error",
        "typescript/no-unnecessary-type-constraint": "error",
        "typescript/no-unsafe-declaration-merging": "error",
        "typescript/no-unsafe-function-type": "error",
        "typescript/no-wrapper-object-types": "error",
        "typescript/prefer-as-const": "error",
        "typescript/prefer-namespace-keyword": "error",
        "typescript/triple-slash-reference": "error",
    },
};

export default config;
