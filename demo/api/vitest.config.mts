import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        exclude: ["dist/**", "node_modules/**"],
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit-unit.xml" },
    },
});
