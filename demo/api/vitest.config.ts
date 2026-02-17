import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "node",
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        exclude: ["dist/**", "node_modules/**"],
    },
});
