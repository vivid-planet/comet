module.exports = {
    extends: [require.resolve("./core.js"), "next/core-web-vitals"],
    rules: {
        "react/display-name": "off",
        "react/jsx-curly-brace-presence": "error",
        "react/prop-types": "off",
        "react/self-closing-comp": "error",
        "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
        "@comet/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    {
                        name: "next/image",
                        importNames: ["default"],
                        message: "Please use Image from @comet/site-next instead",
                    },
                ],
            },
        ],
    },
};
