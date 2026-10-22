import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit-unit.xml",
        },
        projects: [
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: "unit",
                    environment: "jsdom",
                    setupFiles: "./vitest.setup.ts",
                    // The tests that render a data grid take a few seconds and run next to other packages' tests in CI.
                    testTimeout: 10000,
                },
            },
            {
                plugins: [tsconfigPaths(), storybookTest({ configDir: ".storybook" })],
                optimizeDeps: {
                    include: ["storybook/internal/csf", "@storybook/react-vite"],
                },
                test: {
                    name: "storybook",
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium", launch: { channel: "chromium-headless-shell" } }],
                    },
                },
            },
        ],
    },
});
