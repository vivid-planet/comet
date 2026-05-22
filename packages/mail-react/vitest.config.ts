import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.stories.{ts,tsx}", "**/*.d.ts", "lib/**"],
        },
        projects: [
            {
                test: {
                    name: "unit",
                    environment: "node",
                    exclude: ["lib/**", "node_modules/**"],
                },
            },
            {
                plugins: [storybookTest({ configDir: ".storybook" })],
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
