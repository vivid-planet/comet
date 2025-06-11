import type { StorybookConfig } from "@storybook/react-webpack5";
import * as path from "path";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: [
        "@storybook/addon-controls",
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
        {
            name: "@storybook/addon-storysource",
            options: {
                rule: {
                    test: [/\.tsx$/],
                    include: [path.resolve(__dirname, "../src")],
                },
                sourceLoaderOptions: {
                    parser: "typescript",
                    injectStoryParameters: false,
                },
            },
        },
        "@storybook/addon-webpack5-compiler-babel",
    ],
    staticDirs: ["../public"],
    docs: {
        autodocs: true,
    },
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
};

export default config;
