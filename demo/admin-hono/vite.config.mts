import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const emotionImportMap = {
    "@mui/system": {
        styled: { canonicalImport: ["@emotion/styled", "default"], styledBaseImport: ["@mui/system", "styled"] },
    },
    "@mui/material/styles": {
        styled: { canonicalImport: ["@emotion/styled", "default"], styledBaseImport: ["@mui/material/styles", "styled"] },
    },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react({ jsxImportSource: "@emotion/react", plugins: [["@swc/plugin-emotion", { importMap: emotionImportMap }]] })],
    server: {
        host: process.env.SERVER_HOST ?? "localhost",
        port: Number(process.env.ADMIN_HONO_PORT),
        proxy: {
            // Stands in for oauth2-proxy of the NestJS demo: authenticates the requests to the API, so the token never reaches the browser
            "/api": {
                target: process.env.ADMIN_HONO_API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
                headers: { Authorization: `Bearer ${process.env.API_HONO_TOKEN}` },
            },
        },
    },
    define: {
        "process.env.NODE_ENV": mode === "production" ? "'production'" : "'development'",
    },
    build: {
        outDir: "build",
    },
}));
