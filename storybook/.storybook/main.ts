import * as path from "path";

export default {
    framework: "@storybook/react-webpack5",
    stories: ["../src/**/*.@(mdx|stories.tsx)"],
    features: {
        // Workaround for storybook's incompatibility with emotion >= 11
        // See: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#emotion11-quasi-compatibility
        emotionAlias: false,
    },
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
