import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

import { generateScopedName } from "./src/cssModules/generateScopedName";

// Vitest replaces CSS Module class names unless the module is included and scoped through the Vite config.
const cssModules = {
    include: [/\.module\.css$/],
    modules: { classNameStrategy: "scoped" as const },
};

export default defineConfig({
    css: {
        modules: {
            generateScopedName,
        },
    },
    test: {
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit-unit.xml" },
        projects: [
            {
                extends: true,
                test: {
                    name: "unit",
                    environment: "jsdom",
                    // In CI, the unit tests run next to those of other packages, whose timing is tight: sharing jsdom
                    // and the modules between files instead of starting them per file cuts the CPU time to a fifth.
                    isolate: false,
                    setupFiles: "./vitest.setup.ts",
                    include: ["src/**/*.test.{ts,tsx}"],
                    css: cssModules,
                },
            },
            {
                extends: true,
                plugins: [storybookTest({ configDir: ".storybook" })],
                optimizeDeps: {
                    // Pre-bundled up front: a subpath discovered during the run reloads the browser and fails every story.
                    include: [
                        "storybook/internal/csf",
                        "@storybook/react-vite",
                        "@base-ui/react/avatar",
                        "@base-ui/react/button",
                        "@base-ui/react/checkbox",
                        "@base-ui/react/collapsible",
                        "@base-ui/react/combobox",
                        "@base-ui/react/dialog",
                        "@base-ui/react/field",
                        "@base-ui/react/fieldset",
                        "@base-ui/react/input",
                        "@base-ui/react/menu",
                        "@base-ui/react/merge-props",
                        "@base-ui/react/number-field",
                        "@base-ui/react/popover",
                        "@base-ui/react/radio",
                        "@base-ui/react/radio-group",
                        "@base-ui/react/select",
                        "@base-ui/react/separator",
                        "@base-ui/react/switch",
                        "@base-ui/react/tabs",
                        "@base-ui/react/tooltip",
                        "@base-ui/react/use-render",
                    ],
                },
                test: {
                    name: "storybook",
                    css: cssModules,
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
    },
});
