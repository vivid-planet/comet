import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    // Attached pages, such as a component's design tokens, come after its stories, so "Docs" stays first in the sidebar.
    stories: ["../src/*/*.mdx", "../src/**/__stories__/*.stories.tsx", "../src/**/__stories__/*.mdx"],
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
        "@storybook/addon-a11y",
        "@storybook/addon-vitest",
        "@storybook/addon-mcp",
    ],
    typescript: {
        // react-docgen only recognizes components that return JSX, so it skips those that return useRender().
        reactDocgen: "react-docgen-typescript",
    },
    features: {
        // The component manifest is what the MCP server serves to agents.
        componentsManifest: true,
        // Documents the props inherited from Base UI, which react-docgen leaves out.
        experimentalReactComponentMeta: true,
    },
    viteFinal: (viteConfig) => ({
        ...viteConfig,
        // Type declarations are only needed for the package build.
        plugins: viteConfig.plugins?.filter((plugin) => !(plugin && "name" in plugin && plugin.name === "vite:dts")),
    }),
};

export default config;
