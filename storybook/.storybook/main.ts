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
            "@comet/admin": {
                title: "@comet/admin",
                url: configType === "DEVELOPMENT" ? "http://localhost:26646/" : "https://main--68e7b70f15b8f51dac492af6.chromatic.com", // TODO: support pull request previews,
            },
            "@comet/cms-admin": {
                title: "@comet/cms-admin",
                url: configType === "DEVELOPMENT" ? "http://localhost:26647/" : "https://main--69df3371c46abe69b5199825.chromatic.com",
            },
            "@comet/mail-react": {
                title: "@comet/mail-react",
                url: configType === "DEVELOPMENT" ? "http://localhost:6066/" : "https://main--69df33e9280a36be495d6521.chromatic.com",
            },
        };
    },
};

export default config;
