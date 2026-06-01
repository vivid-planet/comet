import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)"],
    staticDirs: ["./public"],

    addons: ["@storybook/addon-docs", "storybook-addon-tag-badges"],
    framework: "@storybook/react-vite",

    async viteFinal(config) {
        config.resolve ??= {};
        config.resolve.alias = {
            ...config.resolve.alias,
            "@comet/cms-admin": path.resolve(__dirname, "../src/index.ts"),
        };
        return config;
    },
};
export default config;
