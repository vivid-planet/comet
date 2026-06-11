import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        // NestJS internally `require`s the CJS build of `graphql`. Force Vite to
        // resolve it the same way so `instanceof` checks across module boundaries
        // (e.g. for `GraphQLScalarType`) work as expected.
        alias: {
            graphql: "graphql/index.js",
        },
    },
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
        testTimeout: 10000,
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "json", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**", "**/generated/**", "**/*.stories.{ts,tsx}", "**/*.d.ts", "**/migrations/**"],
        },
    },
});
