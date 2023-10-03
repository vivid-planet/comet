import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

import envVarsToLoad from "./src/environment";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            createHtmlPlugin({
                minify: true,
                entry: resolve(__dirname, "src/loader.ts"),
                inject: {
                    data: {
                        environmentValues: envVarsToLoad
                            .map(
                                (envVarKey) =>
                                    `window.EXTERNAL__${envVarKey}__ = '${mode === "production" ? `$${envVarKey}` : process.env[envVarKey]}';`,
                            )
                            .join("\n"),
                    },
                },
            }),
        ],
        server: {
            port: Number(process.env.ADMIN_PORT),
        },
        define: {
            // define NODE_ENV for packages using it
            "process.env.NODE_ENV": mode === "production" ? "'production'" : "'development'",
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis. https://github.com/vitejs/vite/discussions/5912
                // "gloabl is not defined" occures dirctly after loading. used by draft-is package
                define: {
                    global: "globalThis",
                },
            },

            include: [
                "@comet/admin",
                "@comet/admin-rte",
                "@comet/admin-date-time",
                "@comet/admin-icons",
                "@comet/admin-theme",
                "@comet/cms-admin",
                "@comet/blocks-admin",
            ],
        },
        resolve: {
            alias: {
                "@src": resolve(__dirname, "./src"),
            },
            //preserveSymlinks: true,
        },
        build: {
            outDir: "build",
        },
    };
});
