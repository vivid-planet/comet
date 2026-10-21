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
                    setupFiles: "./vitest.setup.ts",
                    include: ["src/**/*.test.{ts,tsx}"],
                    css: cssModules,
                },
            },
            {
                extends: true,
                plugins: [storybookTest({ configDir: ".storybook" })],
                optimizeDeps: {
                    include: ["storybook/internal/csf", "@storybook/react-vite"],
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
