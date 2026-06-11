import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.stories.{ts,tsx}", "**/*.d.ts"],
        },
        projects: [
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: "unit",
                    environment: "jsdom",
                    setupFiles: ["./vitest.setup.ts"],
                    testTimeout: 15000,
                },
            },
            {
                plugins: [tsconfigPaths(), storybookTest({ configDir: ".storybook" })],
                define: {
                    global: "globalThis",
                },
                optimizeDeps: {
                    include: ["storybook/internal/csf", "@storybook/react-vite"],
                    esbuildOptions: {
                        define: {
                            global: "globalThis",
                        },
                    },
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
