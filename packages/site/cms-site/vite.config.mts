import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [
        react(),
        cssInjectedByJsPlugin({ relativeCSSInjection: true }), // injects the css in css modules into the js files -> no extra css file import necessary
        dts({ tsconfigPath: "./tsconfig.build.json" }), // generates the types for the library
    ],
    build: {
        cssCodeSplit: true,
        outDir: "lib",
        lib: {
            entry: "./src/index.ts",
            fileName: () => "index.js",
            formats: ["es"],
        },
        rollupOptions: {
            plugins: [preserveDirectives()], // is necessary to preserve "use client" at top of file
            external: (source) => {
                // this is necessary to treat all npm packages as external,
                // otherwise vite will bundle them into the library which caused issues with client / server components
                // supposedly because server code was bundled into the client code
                return !source.startsWith(".") && !source.startsWith("/");
            },
            output: {
                // these options are necessary to prevent bundling everything in one file (doesn't work with client components)
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
        minify: "terser", // Minifies the output for production
        css: {
            modules: {
                localsConvention: "camelCase",
            },
        },
    },
});
