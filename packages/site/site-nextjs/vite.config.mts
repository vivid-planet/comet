import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        react(),
        dts({ tsconfigPath: "./tsconfig.build.json" }), // generates the types for the library
    ],
    build: {
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
                return (
                    // We include @comet/site-react in the build. There are two reasons
                    //      1. we want to include the css from @comet/site-react/css in the generated css file
                    //      2. we want to avoid false-positive edge runtime errors in next when using methods from @comet/site-react in the middleware
                    !source.startsWith("@comet/site-react") &&
                    !source.startsWith(".") &&
                    !source.startsWith("/")
                );
            },
            output: {
                // these options are necessary to prevent bundling everything in one file (doesn't work with client components)
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
        minify: "terser", // Minifies the output for production
    },
});
