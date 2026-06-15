import { createHash } from "node:crypto";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const futureUiModulePattern = /future-ui\/components\/[^/]+\/([A-Z][A-Za-z0-9]+)\.module\.scss$/;
const futureUiClassnamePrefix = "comet";

// Produces the stable class names defined by the Future UI class-name contract instead of Vite's default hashed names.
function generateScopedName(name: string, filename: string): string {
    const futureUiMatch = filename.match(futureUiModulePattern);

    if (futureUiMatch) {
        const componentName = futureUiMatch[2];

        if (name === "root") {
            return `${futureUiClassnamePrefix}${componentName}`;
        }

        const modifierPrefix = "root--";
        if (name.startsWith(modifierPrefix)) {
            return `${futureUiClassnamePrefix}${componentName}--${name.slice(modifierPrefix.length)}`;
        }

        return `${futureUiClassnamePrefix}${componentName}__${name}`;
    }

    // No class-name contract for modules outside future-ui — fall back to a deterministic, file-scoped name.
    return `${name}_${createHash("sha1").update(`${filename}::${name}`).digest("hex").slice(0, 5)}`;
}

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/__stories__/*.stories.@(js|jsx|mjs|ts|tsx)"],
    staticDirs: ["./public"],

    addons: ["@storybook/addon-docs", "@storybook/addon-vitest", "storybook-addon-tag-badges"],
    framework: "@storybook/react-vite",

    viteFinal(viteConfig) {
        return mergeConfig(viteConfig, {
            css: {
                modules: {
                    generateScopedName,
                },
            },
        });
    },
};
export default config;
