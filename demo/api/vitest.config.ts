import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
    },
});
