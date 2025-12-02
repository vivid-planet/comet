import { defineConfig } from "tsdown";
import pluginBabel from "@rollup/plugin-babel";

export default defineConfig({
    platform: "browser",
    unbundle: true,
    plugins: [pluginBabel({ babelHelpers: "bundled" })],
});
