import { defineConfig } from "tsdown";
import { readFileSync } from "fs";
import * as path from "path";

const pkgPath = path.resolve(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

export default defineConfig({
    entry: [
        "src/**/*.ts", // match all .ts files to ensure a .d.ts file is generated for each file
        "!src/**/*.test.*", // ignore test files
        "!src/**/*.spec.*",
        "!src/**/__tests__/**",
        "!src/**/__mocks__/**",
    ],
    unbundle: true, // preserve folder structure
    outDir: "lib",
    format: ["cjs"], // CommonJS for now, TODO: Switch to esm in v9
    platform: "node",
    target: "node22",
    dts: {
        sourcemap: true,
    },
    sourcemap: true,
    clean: true,
    external: [
        // don't bundle devDependencies (tsdown only ignores dependencies and peerDependencies by default)
        // TODO: add to peerDependencies in v9
        ...Object.keys(pkg.devDependencies || {}),
    ],
});
