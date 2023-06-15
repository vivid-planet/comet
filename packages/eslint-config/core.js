const core = require("./core-without-import");

module.exports = {
    extends: require.resolve("./core-without-import.js"),
    plugins: [...core.plugins, "import"],
    rules: {
        "import/no-extraneous-dependencies": "error",
        "import/no-duplicates": "error"
    },
};
