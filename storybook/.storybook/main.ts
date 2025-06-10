import type { StorybookConfig } from "@storybook/react-vite";
import * as path from "path";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: [
        "@storybook/addon-controls",
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
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    async viteFinal(config) {
        // Merge custom configuration into the default config
        const { mergeConfig } = await import("vite");

        return mergeConfig(config, {
            optimizeDeps: {
                include: ["@comet/admin", "@comet/admin-theme", "@comet/admin-icons", "@comet/admin-date-time", "@emotion/react"],
            },
        });
    },
    staticDirs: ["../public"],
    docs: {
        autodocs: true,
    },
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
};

export default config;
