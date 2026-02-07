import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        exclude: ["lib/**", "node_modules/**"],
    },
});
