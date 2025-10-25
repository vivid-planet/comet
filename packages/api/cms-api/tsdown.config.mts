import { defineConfig } from "tsdown";

export default defineConfig({
    entry: [
        "src/**/*.ts",          // match all .ts files to ensure a .d.ts file is generated for each file
        "!src/**/*.test.*",     // ignore test files
        "!src/**/*.spec.*",
        "!src/**/__tests__/**",
        "!src/**/__mocks__/**"
    ],
    unbundle: true,             // preserve folder structure
    outDir: "lib",
    format: ["cjs"], // CommonJS for now, TODO: Switch to esm in v9
    platform: "node",
    target: "node22",
    dts: true,
    sourcemap: true,
    clean: true,
    tsconfig: "./tsconfig.build.json"
});
