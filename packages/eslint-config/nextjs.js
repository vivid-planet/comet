module.exports = {
    extends: [require.resolve("./core-without-import.js"), "next/core-web-vitals"],
    rules: {
        "react/display-name": "off",
        "react/prop-types": "off",
        "react/self-closing-comp": "error",
        "import/no-extraneous-dependencies": "error",
        "@comet/no-private-sibling-import": ["error", ["gql", "sc", "gql.generated"]],
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    {
                        name: "next/link",
                        importNames: ["default"],
                        message: "Please use Link from @comet/cms-site instead",
                    },
                    {
                        name: "next/router",
                        importNames: ["useRouter"],
                        message: "Please use useRouter from @comet/cms-site instead",
                    },
                    {
                        name: "next/image",
                        importNames: ["default"],
                        message: "Please use Image from @comet/cms-site instead",
                    },
                ],
            },
        ],
    },
};
