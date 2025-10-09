import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)"],
    staticDirs: ["./public"],

    addons: ["@storybook/addon-docs", "storybook-addon-tag-badges", "@storybook/addon-webpack5-compiler-babel"],
    framework: "@storybook/react-webpack5",
};
export default config;
