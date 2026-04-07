import path from "path";
import { createRequire } from "module";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);
const graphqlPath = require.resolve("graphql");

export default defineConfig({
    plugins: [
        swc.vite({
            jsc: {
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        }),
    ],
    resolve: {
        // Force graphql to always resolve to the CommonJS version used by require() to avoid
        // dual-module issues between Vite's ESM resolution and Node's require() in NestJS dependencies.
        alias: {
            graphql: graphqlPath,
        },
    },
    test: {
        pool: "forks",
        environment: "node",
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        setupFiles: "./vitest-setup-file.ts",
        testTimeout: 10000,
    },
});
