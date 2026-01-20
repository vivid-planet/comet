import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { type StorybookConfig } from "@storybook/react-vite";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    staticDirs: ["./public"],
    addons: ["@storybook/addon-docs"],
    framework: "@storybook/react-vite",
    viteFinal: (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            "@src": resolve(currentDirectory, "../src"),
        };
        return config;
    },
};
export default config;
