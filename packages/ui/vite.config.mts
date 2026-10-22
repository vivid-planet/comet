import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { defineConfig, type Plugin } from "vite";
import dts from "unplugin-dts/vite";

import { generateScopedName } from "./src/cssModules/generateScopedName";

/** Themes published as `@dextinity/ui/themes/<name>.css`. Other files in `src/themes/` are Storybook-only examples. */
const publishedThemes = ["dextinity"];

export default defineConfig({
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.build.json" }), emitThemes(publishedThemes)],
    css: {
        modules: {
            generateScopedName,
        },
    },
    build: {
        outDir: "lib",
        lib: {
            entry: { index: "./src/index.ts" },
            formats: ["es"],
            cssFileName: "style",
        },
        rolldownOptions: {
            plugins: [preserveDirectives()], // keeps the "use client" directive at the top of each component module
            external: (source) => !source.startsWith(".") && !source.startsWith("/"),
            output: {
                // one output module per source module, so "use client" stays scoped to the client components
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
        minify: false,
        // CSS minification lowers native CSS nesting for the browsers `build.cssTarget` names.
        cssMinify: "esbuild",
    },
});

/**
 * Theme stylesheets aren't imported by any component, so the library build doesn't pick them up by itself.
 * It also emits the declaration TypeScript resolves for the stylesheet exports, which are side-effect imports.
 */
function emitThemes(themeNames: string[]): Plugin {
    const themeFilePath = (themeName: string) => new URL(`./src/themes/${themeName}.css`, import.meta.url);

    return {
        name: "dextinity-ui:emit-themes",
        apply: "build",
        buildStart() {
            for (const themeName of themeNames) {
                this.addWatchFile(fileURLToPath(themeFilePath(themeName)));
            }
        },
        async generateBundle() {
            this.emitFile({ type: "asset", fileName: "css.d.ts", source: "export {};\n" });
            for (const themeName of themeNames) {
                this.emitFile({
                    type: "asset",
                    fileName: `themes/${themeName}.css`,
                    source: await readFile(themeFilePath(themeName), "utf8"),
                });
            }
        },
    };
}
