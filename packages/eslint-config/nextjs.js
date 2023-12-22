module.exports = {
    extends: [require.resolve("./core-without-import.js"), "next/core-web-vitals"],
    rules: {
        "react/display-name": "off",
        "react/prop-types": "off",
        "react/self-closing-comp": "error",
        "import/no-extraneous-dependencies": "error",
        "import/newline-after-import": "error",
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
                    {
                        name: "@mui/material",
                        importNames: ["Alert"],
                        message: "Please use Alert from @comet/admin instead",
                    },
                ],
            },
        ],
    },
};
