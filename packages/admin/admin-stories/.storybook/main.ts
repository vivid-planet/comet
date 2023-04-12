import * as path from "path";

export default {
    stories: ["../src/**/*.@(mdx|tsx)"],
    features: {
        // Workaround for storybook's incompatibility with emotion >= 11
        // See: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#emotion11-quasi-compatibility
        emotionAlias: false,
    },
    addons: [
        "@storybook/addon-knobs",
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
    ],
    staticDirs: ["../public"],
    core: {
        builder: "webpack5",
    },
};
