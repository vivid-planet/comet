module.exports = {
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    plugins: ["simple-import-sort", "unused-imports", "json-files", "@comet", "import"],
    rules: {
        "no-unused-vars": "off",
        "prefer-template": "error",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
        "unused-imports/no-unused-imports": "error",
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-return-await": "error",
        "json-files/sort-package-json": "error",
        "@comet/no-other-module-relative-import": ["warn"],
        "import/no-extraneous-dependencies": "error",
        "import/no-duplicates": "error",
        "import/newline-after-import": "error",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            parser: "@typescript-eslint/parser",
            extends: ["plugin:@typescript-eslint/recommended"],
            plugins: ["@typescript-eslint"],
            rules: {
                "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
                "@typescript-eslint/no-inferrable-types": ["error", { ignoreProperties: true }],
            },
        },
    ],
};
