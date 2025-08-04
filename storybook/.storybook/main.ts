import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
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
    ],
    staticDirs: ["../public"],
    async viteFinal(config) {
        // Merge custom configuration into the default config
        const { mergeConfig } = await import("vite");

        return mergeConfig(config, {
            optimizeDeps: {
                include: [
                    "@comet/admin-icons",
                    "@comet/admin-date-time",
                    "@comet/admin",
                    "@comet/cms-admin",
                    "@comet/admin-color-picker",
                    "@comet/admin-rte",
                    "@emotion/react",
                ],
            },
        });
    },
};

export default config;
