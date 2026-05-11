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
        swc.vite({
            jsc: {
                parser: {
                    syntax: "typescript",
                    decorators: true,
                },
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
                target: "es2023",
            },
        }),
    ],
    test: {
        environment: "node",
        setupFiles: ["./vitest.setup.ts"],
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
        testTimeout: 10000,
    },
});
