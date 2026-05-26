import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        exclude: ["dist/**", "node_modules/**"],
        reporters: process.env.GITHUB_ACTIONS ? ["default", "junit", "github-actions"] : ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
    },
});
