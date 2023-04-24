module.exports = {
    extends: require.resolve("./core.js"),
    env: {
        node: true,
        jest: true,
    },
    rules: {
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: ["interface", "typeAlias"],
                format: ["PascalCase"],
                custom: { regex: "^I[A-Z]", match: false },
            },
        ],
        "import/order": "off",
        "no-console": "off",
        "no-duplicate-imports": "error",
        "sort-imports": "off",
    },
};
