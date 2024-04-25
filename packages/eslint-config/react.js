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
        "react/self-closing-comp": "error",
        "react/display-name": "off",
        "react/prop-types": "off",
        "react/jsx-curly-brace-presence": "error",
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    {
                        name: "@mui/material",
                        importNames: ["styled"],
                        message: "Please use styled from @mui/material/styles instead.",
                    },
                    {
                        name: "@mui/material",
                        importNames: ["Badge"],
                        message: "Please use Badge from @comet/admin instead",
                    },
                    {
                        name: "@mui/material",
                        importNames: ["Alert"],
                        message: "Please use Alert from @comet/admin instead",
                    },
                ],
            },
        ],
        "@comet/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],
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
