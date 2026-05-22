import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.stories.{ts,tsx}", "**/*.d.ts"],
        },
    },
});
