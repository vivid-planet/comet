import type { StorybookConfig } from "@storybook/react-webpack5";
import remarkGfm from "remark-gfm";
import { type StorybookConfigRaw } from "storybook/internal/types";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: [
        {
            name: "@storybook/addon-docs",
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                },
            },
        },
        "@storybook/addon-webpack5-compiler-babel",
    ],

    env: (config) => ({
        ...config,
        MUI_LICENSE_KEY: process.env.MUI_LICENSE_KEY || "",
    }),
    staticDirs: ["../public"],
    refs: (config, { configType }) => {
        const refs: StorybookConfigRaw["refs"] = {
            "@comet/admin": {
                title: "@comet/admin",
                url: configType === "DEVELOPMENT" ? "http://localhost:26646/" : "https://main--68e7b70f15b8f51dac492af6.chromatic.com", // TODO: support pull request previews,
            },
        };

        if (configType === "DEVELOPMENT") {
            refs["demo/api"] = {
                title: "demo/api",
                url: "http://localhost:4004/",
            };
        }

        return refs;
    },
};

export default config;
