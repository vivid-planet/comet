import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: process.env.GITHUB_ACTIONS ? ["default", "junit", "github-actions"] : ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
    },
});
