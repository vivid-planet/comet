import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    staticDirs: ["./public"],
    addons: ["./addons/adminGeneratorConfigPanel/register.ts", "@storybook/addon-docs", "@storybook/addon-webpack5-compiler-babel",],
    framework: "@storybook/react-webpack5",
    env: (config) => ({
        ...config,
        MUI_LICENSE_KEY: process.env.MUI_LICENSE_KEY || "",
    }),
};
export default config;
