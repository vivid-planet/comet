import { createHash } from "node:crypto";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const futureUiModulePattern = /future-ui\/components\/[^/]+\/([A-Z][A-Za-z0-9]+)\.module\.scss$/;
const futureUiClassnamePrefix = "comet";

// Produces the stable class names defined by the Future UI class-name contract instead of Vite's default hashed names.
function generateScopedName(name: string, filename: string): string {
    const futureUiMatch = filename.match(futureUiModulePattern);

    if (futureUiMatch) {
        const componentName = futureUiMatch[1];

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

    addons: ["@storybook/addon-designs", "@storybook/addon-docs", "@storybook/addon-vitest", "storybook-addon-tag-badges"],
    framework: "@storybook/react-vite",

    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            propFilter: (prop) => {
                // `react-docgen-typescript` leaves `declarations` empty for some inherited props; read `parent`
                // instead to find where the prop is declared. https://github.com/storybookjs/storybook/issues/23543
                const origins = prop.declarations?.length ? prop.declarations : prop.parent ? [prop.parent] : [];
                const isInheritedFromDependency = origins.length > 0 && origins.every((origin) => origin.fileName.includes("node_modules"));
                return !isInheritedFromDependency;
            },
        },
    },

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
