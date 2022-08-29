import "webpack-dev-server";

import ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

import environment from "./src/environment";

interface IEnvironment {
    production: boolean;
}

const config = ({ production }: IEnvironment): webpack.Configuration => {
    const publicPath = "/";

    const plugins: webpack.WebpackPluginInstance[] = [
        new webpack.DefinePlugin({
            CONFIG_DEV_LOCAL_EXISTS: fs.existsSync(path.resolve(__dirname, "src/config/dev.local.ts")),
            PREVIEW_URL: JSON.stringify(process.env.PREVIEW_URL),
        }),
        new HtmlWebpackPlugin({
            template: "public/index.ejs",
            templateParameters: {
                environmentValues: environment.map((env) => ({ key: env, value: production ? `$${env}` : process.env[env] })),
            },
            hash: true,
        }),
        new HtmlWebpackPlugin({
            template: require.resolve("@comet/cms-admin/access-token-service-worker.ejs"),
            templateParameters: {
                API_URL: production ? "$API_URL" : process.env.API_URL,
            },
            filename: "access-token-service-worker.js",
            inject: false,
            minify: false,
        }),
    ];
    if (production) {
        plugins.push(
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify("production"),
            }),
        );
    } else {
        plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return {
        mode: production ? "production" : "development",
        entry: {
            "comet-demo-admin": ["./src/polyfills.ts", "./src/pre-loader.ts", "./src/loader.ts"],
        },
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "files/",
                        name: "[name].[ext]",
                    },
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: require.resolve("babel-loader"),
                    options: {
                        customize: require.resolve("babel-preset-react-app/webpack-overrides"),
                        babelrc: false,
                        configFile: false,
                        presets: [
                            [
                                require.resolve("babel-preset-react-app"),
                                {
                                    runtime: "automatic",
                                },
                            ],
                        ],
                        plugins: [
                            [
                                "@emotion",
                                {
                                    importMap: {
                                        "@mui/system": {
                                            styled: {
                                                canonicalImport: ["@emotion/styled", "default"],
                                                styledBaseImport: ["@mui/system", "styled"],
                                            },
                                        },
                                        "@mui/material/styles": {
                                            styled: {
                                                canonicalImport: ["@emotion/styled", "default"],
                                                styledBaseImport: ["@mui/material/styles", "styled"],
                                            },
                                        },
                                    },
                                },
                            ],
                            require.resolve("babel-plugin-inline-react-svg"),
                        ],
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.(js|mjs)$/,
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    loader: require.resolve("babel-loader"),
                    options: {
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        presets: [[require.resolve("babel-preset-react-app/dependencies"), { helpers: true }]],
                        cacheDirectory: true,
                        cacheCompression: false,
                        sourceMaps: false,
                    },
                },
                {
                    test: /\.css?$/,
                    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
                },
            ],
        },
        plugins,
        optimization: {
            sideEffects: true,
            usedExports: true,
        },
        resolve: {
            modules: ["node_modules"],
            descriptionFiles: ["package.json"],
            mainFields: ["browser", "module", "main"],
            extensions: ["*", ".mjs", ".js", ".jsx", ".ts", ".tsx"],
            alias: {
                "@src": path.resolve(__dirname, "src/"),
            },
            fallback: {
                "react/jsx-runtime": "react/jsx-runtime.js",
                "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
            },
        },
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "[name].js",
            chunkFilename: "[id].chunk.js?v=[chunkhash]",
            publicPath,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, "public"),
            },
            host: "0.0.0.0",
            port: Number(process.env.ADMIN_PORT || 8001),
            allowedHosts: "all",
            compress: true,
            client: {
                webSocketURL: {
                    port: Number(process.env.PROXY_PORT),
                },
            },
            historyApiFallback: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },
    };
};

export default config;
