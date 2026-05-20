import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
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
                url: configType === "DEVELOPMENT" ? "http://localhost:26646/" : chromaticUrl("68e7b70f15b8f51dac492af6"),
            },
            "@comet/cms-admin": {
                title: "@comet/cms-admin",
                url: configType === "DEVELOPMENT" ? "http://localhost:26647/" : chromaticUrl("69df3371c46abe69b5199825"),
            },
            "@comet/mail-react": {
                title: "@comet/mail-react",
                url: configType === "DEVELOPMENT" ? "http://localhost:6066/" : chromaticUrl("69df33e9280a36be495d6521"),
            },
        };
    },
};

// On Netlify deploy-previews, `HEAD` is the PR source branch; on branch-deploys, `BRANCH` is the deployed branch.
// Chromatic publishes a build per branch at `https://<sanitized-branch>--<projectId>.chromatic.com`,
// where the branch is lowercased and non-alphanumeric characters become `-`.
function chromaticUrl(projectId: string): string {
    const branch = process.env.HEAD ?? process.env.BRANCH ?? "main";
    const sanitizedBranch = branch.toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `https://${sanitizedBranch}--${projectId}.chromatic.com`;
}

export default config;
