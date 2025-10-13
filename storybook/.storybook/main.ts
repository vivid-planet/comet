import type { StorybookConfig } from "@storybook/react-webpack5";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: "@storybook/react-webpack5",
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
        "@storybook/addon-webpack5-compiler-babel",
    ],

    env: (config) => ({
        ...config,
        MUI_LICENSE_KEY: process.env.MUI_LICENSE_KEY || "",
    }),
    staticDirs: ["../public"],
    refs: (config, { configType }) => {
        return {
            "@comet/admin-generator": {
                title: "@comet/admin-generator",
                url: configType === "DEVELOPMENT" ? "http://localhost:26640/" : "https://main--68d0fa17ae507df1e8b2f3af.chromatic.com", // TODO: support pull request previews,
            },
        };
    },
};

export default config;
