import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  staticDirs: ["./public"],
  addons: [
    "@storybook/addon-controls",
    {
      name: "@storybook/addon-essentials",
      options: {
        actions: false,
      },
    },
    "storybook-addon-tag-badges",
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      optimizeDeps: {
        include: ["@comet/admin", "@comet/admin-theme", "@comet/admin-icons", "@comet/admin-date-time", "@emotion/react"],
      },
    });
  },
};
export default config;