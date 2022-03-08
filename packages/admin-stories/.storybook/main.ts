import * as path from "path";

export default {
    stories: ["../src/**/*.@(mdx|tsx)"],
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
};
