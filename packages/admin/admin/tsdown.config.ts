import { defineConfig } from "tsdown";
import pluginBabel from "@rollup/plugin-babel";

export default defineConfig({
    platform: "browser",
    unbundle: true,
    plugins: [
        pluginBabel({
            babelHelpers: "bundled",
            parserOpts: {
                sourceType: "module",
                plugins: ["jsx", "typescript"],
            },
            plugins: [
                [
                "@emotion",
                {
                    importMap: {
                        "@mui/system": {
                            styled: {
                                canonicalImport: ["@emotion/styled", "default"],
                                styledBaseImport: ["@mui/system", "styled"],
                            },
                        },
                        "@mui/material/styles": {
                            styled: {
                                canonicalImport: ["@emotion/styled", "default"],
                                styledBaseImport: ["@mui/material/styles", "styled"],
                            },
                        },
                    },
                },
            ],
            ],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }),
    ],
});
