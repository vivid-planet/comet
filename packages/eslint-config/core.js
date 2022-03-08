module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "simple-import-sort", "unused-imports", "import"],
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "prefer-template": "error",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
        "unused-imports/no-unused-imports": "error",
        "import/no-extraneous-dependencies": "error",
        "no-duplicate-imports": "error",
        "no-console": "error",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
            },
        },
    ],
};
