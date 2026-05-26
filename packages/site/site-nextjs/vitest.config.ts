import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        reporters: process.env.GITHUB_ACTIONS ? ["default", "junit", "github-actions"] : ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
    },
});
