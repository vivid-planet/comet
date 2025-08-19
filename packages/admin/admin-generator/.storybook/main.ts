import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  staticDirs: ["./public"],

  addons: [
    "./addons/adminGeneratorConfigPanel/register.ts",
    "@storybook/addon-docs"
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

  features: {
    actions: false
  }
};
export default config;