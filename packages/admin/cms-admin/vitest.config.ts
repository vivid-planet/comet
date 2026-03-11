import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "jsdom",
        setupFiles: ["./src/testing/vitest.setup.ts"],
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./junit.xml",
        },
    },
});
