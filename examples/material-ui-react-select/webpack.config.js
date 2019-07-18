const path = require("path");

module.exports = {
    mode: "development",
    optimization: {
        usedExports: true,
    },
    entry: {
        example: ["./src/index.tsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
            {
                test: /\.css?$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
        ],
    },
    resolve: {
        modules: ["node_modules"],
        descriptionFiles: ["package.json"],
        mainFields: ["browser", "module", "main"],
        extensions: ["*", ".mjs", ".js", ".jsx", ".ts", ".tsx"],
        alias: {
            app: path.resolve(__dirname, "src/"),
        },
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/build/",
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        contentBase: path.join(__dirname, "public"),
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
};
