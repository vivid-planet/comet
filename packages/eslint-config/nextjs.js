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
                        message: "Please use Image from @comet/cms-site instead",
                    },
                ],
            },
        ],
        "no-restricted-syntax": [
            "error",
            {
                selector:
                    "MemberExpression[type=MemberExpression][object.type=MemberExpression][object.object.type=Identifier][object.object.name=process][object.property.type=Identifier][object.property.name=env][property.type=Identifier][property.name=/^NEXT_PUBLIC/]",
                message: "Avoid using NEXT_PUBLIC_ environment variables",
            },
        ],
    },
    overrides: [
        {
            files: ["next.config.js"],
            rules: {
                "no-restricted-syntax": [
                    "error",
                    {
                        selector:
                            "MemberExpression[type=MemberExpression][object.type=MemberExpression][object.object.type=Identifier][object.object.name=process][object.property.type=Identifier][object.property.name=env][property.type=Identifier][property.name=NODE_ENV]",
                        message: "Avoid using environment variables other than NODE_ENV",
                    },
                ],
            },
        },
    ],
};
