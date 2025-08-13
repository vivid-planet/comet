import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: ["@storybook/addon-docs", "storybook-addon-tag-badges"],
    staticDirs: ["../public"],
    async viteFinal(config) {
        // Merge custom configuration into the default config
        const { mergeConfig } = await import("vite");

        return mergeConfig(config, {
            optimizeDeps: {
                include: ["@comet/admin", "@comet/admin-icons", "@comet/admin-date-time", "@emotion/react"],
            },
        });
    },
};

export default config;
