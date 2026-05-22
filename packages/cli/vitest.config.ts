import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        exclude: ["lib/**", "node_modules/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.d.ts", "lib/**"],
        },
    },
});
