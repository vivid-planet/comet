import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.stories.tsx"],
    addons: ["@storybook/addon-docs", "@storybook/addon-webpack5-compiler-babel"],
    staticDirs: ["../../site/public"],
    webpackFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            "@src/blocks.generated": path.resolve(__dirname, "mocks/blocks.generated.ts"),
            "@comet/site-nextjs": path.resolve(__dirname, "mocks/comet-site-nextjs.tsx"),
            "next/link": path.resolve(__dirname, "mocks/next-link.tsx"),
            "next/image": path.resolve(__dirname, "mocks/next-image.tsx"),
            "@src": path.resolve(__dirname, "../../site/src"),
        };

        config.module = config.module || {};
        config.module.rules = config.module.rules || [];

        // Add SCSS module support
        config.module.rules.push({
            test: /\.module\.scss$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: {
                            localIdentName: "[name]__[local]--[hash:base64:5]",
                        },
                    },
                },
                "sass-loader",
            ],
        });

        // Add regular SCSS support (non-modules)
        config.module.rules.push({
            test: /\.scss$/,
            exclude: /\.module\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
        });

        return config;
    },
};

export default config;
