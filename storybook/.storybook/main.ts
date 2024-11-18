import type { StorybookConfig } from "@storybook/react-webpack5";
import * as path from "path";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    addons: [
        "@storybook/addon-controls",
        {
            name: "@storybook/addon-docs",
            options: {},
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
