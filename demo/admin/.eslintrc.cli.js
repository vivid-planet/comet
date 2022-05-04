module.exports = {
    extends: ["./.eslintrc.json"],
    plugins: ["graphql"],
    rules: {
        "graphql/template-strings": [
            "error",
            {
                env: "apollo",
                schemaJson: require("./schema.json"),
            },
        ],
    },
};
