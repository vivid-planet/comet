// vite.config.mts
import react from "file:///Users/anru/dev/comet/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.2.8/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { defineConfig } from "file:///Users/anru/dev/comet/node_modules/.pnpm/vite@5.2.8_@types+node@18.15.3/node_modules/vite/dist/node/index.js";
import { createHtmlPlugin } from "file:///Users/anru/dev/comet/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.2.8/node_modules/vite-plugin-html/dist/index.mjs";

// src/environment.ts
var environment = [
  "API_URL",
  "ADMIN_URL",
  "SITES_CONFIG",
  "SITE_PREVIEW_URL",
  "COMET_DEMO_API_URL",
  "BUILD_DATE",
  "BUILD_NUMBER",
  "COMMIT_SHA"
];

// vite.config.mts
var __vite_injected_original_dirname = "/Users/anru/dev/comet/demo/admin";
var vite_config_default = defineConfig(({ mode }) => {
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
                    styledBaseImport: ["@mui/system", "styled"]
                  }
                },
                "@mui/material/styles": {
                  styled: {
                    canonicalImport: ["@emotion/styled", "default"],
                    styledBaseImport: ["@mui/material/styles", "styled"]
                  }
                }
              }
            }
          ]
        ]
      }),
      createHtmlPlugin({
        minify: true,
        entry: resolve(__vite_injected_original_dirname, "src/loader.ts"),
        inject: {
          data: {
            environmentValues: environment.map((envVarKey) => ({
              key: envVarKey,
              value: mode === "production" ? `$${envVarKey}` : process.env[envVarKey]
            }))
          }
        }
      })
    ],
    server: {
      port: Number(process.env.ADMIN_PORT)
    },
    define: {
      // define NODE_ENV for packages using it
      "process.env.NODE_ENV": mode === "production" ? "'production'" : "'development'"
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis. https://github.com/vitejs/vite/discussions/5912
        // "global is not defined" occurs directly after loading. Used by draft-is package
        define: {
          global: "globalThis"
        }
      },
      include: [
        "@comet/admin",
        "@comet/admin-rte",
        "@comet/admin-date-time",
        "@comet/admin-icons",
        "@comet/admin-theme",
        "@comet/cms-admin",
        "@comet/blocks-admin"
      ]
    },
    resolve: {
      alias: {
        "@src": resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      outDir: "build"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInNyYy9lbnZpcm9ubWVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hbnJ1L2Rldi9jb21ldC9kZW1vL2FkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYW5ydS9kZXYvY29tZXQvZGVtby9hZG1pbi92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FucnUvZGV2L2NvbWV0L2RlbW8vYWRtaW4vdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xuXG5pbXBvcnQgeyBlbnZpcm9ubWVudCBhcyBlbnZWYXJzVG9Mb2FkIH0gZnJvbSBcIi4vc3JjL2Vudmlyb25tZW50XCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgcmVhY3Qoe1xuICAgICAgICAgICAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJAc3djL3BsdWdpbi1lbW90aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0TWFwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQG11aS9zeXN0ZW1cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2Fub25pY2FsSW1wb3J0OiBbXCJAZW1vdGlvbi9zdHlsZWRcIiwgXCJkZWZhdWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlZEJhc2VJbXBvcnQ6IFtcIkBtdWkvc3lzdGVtXCIsIFwic3R5bGVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAbXVpL21hdGVyaWFsL3N0eWxlc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5vbmljYWxJbXBvcnQ6IFtcIkBlbW90aW9uL3N0eWxlZFwiLCBcImRlZmF1bHRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkQmFzZUltcG9ydDogW1wiQG11aS9tYXRlcmlhbC9zdHlsZXNcIiwgXCJzdHlsZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2xvYWRlci50c1wiKSxcbiAgICAgICAgICAgICAgICBpbmplY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYWx1ZXM6IGVudlZhcnNUb0xvYWQubWFwKChlbnZWYXJLZXkpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBlbnZWYXJLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gYCQke2VudlZhcktleX1gIDogcHJvY2Vzcy5lbnZbZW52VmFyS2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52LkFETUlOX1BPUlQpLFxuICAgICAgICB9LFxuICAgICAgICBkZWZpbmU6IHtcbiAgICAgICAgICAgIC8vIGRlZmluZSBOT0RFX0VOViBmb3IgcGFja2FnZXMgdXNpbmcgaXRcbiAgICAgICAgICAgIFwicHJvY2Vzcy5lbnYuTk9ERV9FTlZcIjogbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCIgPyBcIidwcm9kdWN0aW9uJ1wiIDogXCInZGV2ZWxvcG1lbnQnXCIsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICAgICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAvLyBOb2RlLmpzIGdsb2JhbCB0byBicm93c2VyIGdsb2JhbFRoaXMuIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS9kaXNjdXNzaW9ucy81OTEyXG4gICAgICAgICAgICAgICAgLy8gXCJnbG9iYWwgaXMgbm90IGRlZmluZWRcIiBvY2N1cnMgZGlyZWN0bHkgYWZ0ZXIgbG9hZGluZy4gVXNlZCBieSBkcmFmdC1pcyBwYWNrYWdlXG4gICAgICAgICAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW5cIixcbiAgICAgICAgICAgICAgICBcIkBjb21ldC9hZG1pbi1ydGVcIixcbiAgICAgICAgICAgICAgICBcIkBjb21ldC9hZG1pbi1kYXRlLXRpbWVcIixcbiAgICAgICAgICAgICAgICBcIkBjb21ldC9hZG1pbi1pY29uc1wiLFxuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2FkbWluLXRoZW1lXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvY21zLWFkbWluXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYmxvY2tzLWFkbWluXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgICAgIFwiQHNyY1wiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBvdXREaXI6IFwiYnVpbGRcIixcbiAgICAgICAgfSxcbiAgICB9O1xufSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5ydS9kZXYvY29tZXQvZGVtby9hZG1pbi9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbnJ1L2Rldi9jb21ldC9kZW1vL2FkbWluL3NyYy9lbnZpcm9ubWVudC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYW5ydS9kZXYvY29tZXQvZGVtby9hZG1pbi9zcmMvZW52aXJvbm1lbnQudHNcIjtleHBvcnQgY29uc3QgZW52aXJvbm1lbnQgPSBbXG4gICAgXCJBUElfVVJMXCIsXG4gICAgXCJBRE1JTl9VUkxcIixcbiAgICBcIlNJVEVTX0NPTkZJR1wiLFxuICAgIFwiU0lURV9QUkVWSUVXX1VSTFwiLFxuICAgIFwiQ09NRVRfREVNT19BUElfVVJMXCIsXG4gICAgXCJCVUlMRF9EQVRFXCIsXG4gICAgXCJCVUlMRF9OVU1CRVJcIixcbiAgICBcIkNPTU1JVF9TSEFcIixcbl0gYXMgY29uc3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9SLE9BQU8sV0FBVztBQUN0UyxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyx3QkFBd0I7OztBQ0hvUSxJQUFNLGNBQWM7QUFBQSxFQUNyVDtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDSjs7O0FEVEEsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDdEMsU0FBTztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ0wsTUFBTTtBQUFBLFFBQ0YsaUJBQWlCO0FBQUEsUUFDakIsU0FBUztBQUFBLFVBQ0w7QUFBQSxZQUNJO0FBQUEsWUFDQTtBQUFBLGNBQ0ksV0FBVztBQUFBLGdCQUNQLGVBQWU7QUFBQSxrQkFDWCxRQUFRO0FBQUEsb0JBQ0osaUJBQWlCLENBQUMsbUJBQW1CLFNBQVM7QUFBQSxvQkFDOUMsa0JBQWtCLENBQUMsZUFBZSxRQUFRO0FBQUEsa0JBQzlDO0FBQUEsZ0JBQ0o7QUFBQSxnQkFDQSx3QkFBd0I7QUFBQSxrQkFDcEIsUUFBUTtBQUFBLG9CQUNKLGlCQUFpQixDQUFDLG1CQUFtQixTQUFTO0FBQUEsb0JBQzlDLGtCQUFrQixDQUFDLHdCQUF3QixRQUFRO0FBQUEsa0JBQ3ZEO0FBQUEsZ0JBQ0o7QUFBQSxjQUNKO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSixDQUFDO0FBQUEsTUFDRCxpQkFBaUI7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLE9BQU8sUUFBUSxrQ0FBVyxlQUFlO0FBQUEsUUFDekMsUUFBUTtBQUFBLFVBQ0osTUFBTTtBQUFBLFlBQ0YsbUJBQW1CLFlBQWMsSUFBSSxDQUFDLGVBQWU7QUFBQSxjQUNqRCxLQUFLO0FBQUEsY0FDTCxPQUFPLFNBQVMsZUFBZSxJQUFJLFNBQVMsS0FBSyxRQUFRLElBQUksU0FBUztBQUFBLFlBQzFFLEVBQUU7QUFBQSxVQUNOO0FBQUEsUUFDSjtBQUFBLE1BQ0osQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNKLE1BQU0sT0FBTyxRQUFRLElBQUksVUFBVTtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxRQUFRO0FBQUE7QUFBQSxNQUVKLHdCQUF3QixTQUFTLGVBQWUsaUJBQWlCO0FBQUEsSUFDckU7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNWLGdCQUFnQjtBQUFBO0FBQUE7QUFBQSxRQUdaLFFBQVE7QUFBQSxVQUNKLFFBQVE7QUFBQSxRQUNaO0FBQUEsTUFDSjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ0w7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsT0FBTztBQUFBLFFBQ0gsUUFBUSxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0o7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxJQUNaO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
