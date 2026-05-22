import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        // The SWC plugin is required to emit decorator metadata.
        // See https://github.com/vitest-dev/vitest/discussions/3320.
        swc.vite(),
    ],
    test: {
        environment: "node",
        setupFiles: ["./vitest.setup.ts"],
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
        testTimeout: 60000,
        hookTimeout: 60000,
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.stories.{ts,tsx}", "**/*.d.ts", "**/migrations/**"],
        },
    },
});
