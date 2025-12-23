import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig, type Plugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

import { environment as envVarsToLoad } from "./src/environment";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react({
                jsxImportSource: "@emotion/react",
                plugins: [
                    [
                        "@swc/plugin-emotion",
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
            createHtmlPlugin({
                minify: true,
                entry: resolve(__dirname, "src/loader.ts"),
                inject: {
                    data: {
                        environmentValues: envVarsToLoad.map((envVarKey) => ({
                            key: envVarKey,
                            value: mode === "production" ? `$${envVarKey}` : process.env[envVarKey],
                        })),
                    },
                },
            }),
        ],
        server: {
            host: process.env.SERVER_HOST ?? "localhost",
            port: Number(process.env.ADMIN_PORT),
            cors: false,
            proxy: process.env.API_URL_INTERNAL
                ? {
                      "/api": {
                          target: new URL(process.env.API_URL_INTERNAL).origin,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/dam": {
                          target: process.env.API_URL_INTERNAL,
                          changeOrigin: true,
                          secure: false,
                      },
                  }
                : undefined,
        },
        define: {
            // define NODE_ENV for packages using it
            "process.env.NODE_ENV": mode === "production" ? "'production'" : "'development'",
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis. https://github.com/vitejs/vite/discussions/5912
                // "global is not defined" occurs directly after loading. Used by draft-is package
                define: {
                    global: "globalThis",
                },
            },
        },
        resolve: {
            alias: {
                "@src": resolve(__dirname, "./src"),
            },
        },
        build: {
            outDir: "build",
        },
    };
});
