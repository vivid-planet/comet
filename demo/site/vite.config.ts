import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { resolve } from "node:path";
import { defineConfig } from "vite";

import { persistedQueriesPlugin } from "./vitePersistedQueriesPlugin";

export default defineConfig({
    // The site doesn't use VITE_* variables, and the .env files of the repository would set NODE_ENV for the build
    envDir: false,
    plugins: [
        rsc({
            entries: {
                rsc: "./src/framework/entry.rsc.tsx",
                ssr: "./src/framework/entry.ssr.tsx",
                client: "./src/framework/entry.browser.tsx",
            },
        }),
        react(),
        persistedQueriesPlugin({ persistedQueriesPath: "dist/persisted-queries.json", include: resolve(import.meta.dirname, "src") }),
    ],
    resolve: {
        alias: {
            "@src": resolve(import.meta.dirname, "src"),
        },
    },
    environments: {
        ssr: {
            resolve: {
                noExternal: [
                    // CommonJS dependencies whose exports aren't detected by Node.js when imported from ESM
                    "prop-types",
                    "redraft",
                    // Imports React without declaring it as peer dependency, it would get a separate React instance when externalized
                    "swiper",
                ],
            },
            optimizeDeps: { include: ["react-focus-lock > prop-types", "redraft"] },
        },
        client: {
            build: {
                // public/assets is served with a shorter cache duration, see server.ts
                assetsDir: "_assets",
            },
        },
    },
});
