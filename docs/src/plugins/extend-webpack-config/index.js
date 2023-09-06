/**
 * Workaround for react-dnd
 */
module.exports = function extendWebpackConfigPlugin() {
    return {
        name: "extend-webpack-config",
        configureWebpack() {
            return {
                resolve: {
                    alias: {
                        // https://github.com/facebook/react/issues/20235
                        // https://github.com/facebook/create-react-app/issues/11769
                        "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
                        "react/jsx-runtime": "react/jsx-runtime.js",
                    },
                },
            };
        },
    };
};
