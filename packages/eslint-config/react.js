const core = require("./core");

module.exports = {
    extends: [require.resolve("./core.js"), "plugin:react/recommended", "plugin:react-hooks/recommended"],
    env: {
        browser: true,
        es6: true,
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    plugins: [...core.plugins, "react", "react-hooks", "formatjs", "@calm/react-intl"],
    rules: {
        "@calm/react-intl/missing-formatted-message": ["error", { enforceLabels: true }],
        "formatjs/enforce-default-message": "error",
        "formatjs/enforce-placeholders": "error",
        "react/display-name": "off",
        "react/prop-types": "off",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "error",
            },
        },
    ],
};
