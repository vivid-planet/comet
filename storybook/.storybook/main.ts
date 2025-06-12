import type { StorybookConfig } from "@storybook/react-webpack5";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: [
        {
            name: "@storybook/addon-essentials",
            options: {
                actions: false,
            },
        },
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
    staticDirs: ["../public"],
};

export default config;
