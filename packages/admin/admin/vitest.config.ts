import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "jsdom",
        reporters: process.env.GITHUB_ACTIONS ? ["default", "junit", "github-actions"] : ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
        setupFiles: "./vitest.setup.ts",
    },
});
