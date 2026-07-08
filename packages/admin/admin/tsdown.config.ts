import { babel } from "@rollup/plugin-babel";
import { createHash } from "node:crypto";

import { defineConfig } from "tsdown";

// Generate static, deterministic CSS Modules class names for the published library. The scoped name
// is derived from the file name, the local class name and a short content hash so it stays stable
// across builds and independent of the file's path.
function generateScopedName(name: string, filename: string, css: string): string {
    const componentName = filename
        .split(/[\\/]/)
        .pop()!
        .replace(/\.module\.\w+$/, "");
    const hash = createHash("sha256").update(css).update(name).digest("base64url").slice(0, 5);
    return `${componentName}_${name}_${hash}`;
}

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "lib",
    platform: "browser",
    format: ["es"],
    dts: {
        sourcemap: false,
    },
    sourcemap: false,
    deps: {
        // Treat everything that isn't a relative/absolute import as external so no dependency (React,
        // MUI, Emotion, ...) gets bundled into the library output.
        neverBundle: [/^[^./]/],
    },
    plugins: [
        // Run the Emotion Babel plugin so styled components can be used as CSS selectors ("components
        // as selectors"): the plugin assigns each styled component a stable target class. The importMap
        // extends this to MUI's `styled`, which re-exports Emotion's `styled`.
        babel({
            babelHelpers: "bundled",
            extensions: [".ts", ".tsx"],
            presets: [
                ["@babel/preset-typescript", { allowDeclareFields: true }],
                ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
                [
                    "@emotion/babel-plugin",
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
        }),
    ],
    css: {
        // Use the PostCSS transformer so CSS Modules are processed with postcss-modules, which supports
        // a function for generating static class names.
        transformer: "postcss",
        modules: {
            generateScopedName,
        },
    },
});
