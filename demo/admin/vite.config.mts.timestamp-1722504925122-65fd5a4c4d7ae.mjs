// vite.config.mts
import react from "file:///Users/anru/dev/comet/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.1.6/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { defineConfig } from "file:///Users/anru/dev/comet/node_modules/.pnpm/vite@5.1.6_@types+node@18.15.3/node_modules/vite/dist/node/index.js";
import { createHtmlPlugin } from "file:///Users/anru/dev/comet/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.1.6/node_modules/vite-plugin-html/dist/index.mjs";

// src/environment.ts
var environment = ["API_URL", "ADMIN_URL", "SITES_CONFIG", "COMET_DEMO_API_URL", "BUILD_DATE", "BUILD_NUMBER", "COMMIT_SHA"];

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
      host: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInNyYy9lbnZpcm9ubWVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9hbnJ1L2Rldi9jb21ldC9kZW1vL2FkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYW5ydS9kZXYvY29tZXQvZGVtby9hZG1pbi92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FucnUvZGV2L2NvbWV0L2RlbW8vYWRtaW4vdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xuXG5pbXBvcnQgeyBlbnZpcm9ubWVudCBhcyBlbnZWYXJzVG9Mb2FkIH0gZnJvbSBcIi4vc3JjL2Vudmlyb25tZW50XCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgcmVhY3Qoe1xuICAgICAgICAgICAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJAc3djL3BsdWdpbi1lbW90aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0TWFwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQG11aS9zeXN0ZW1cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2Fub25pY2FsSW1wb3J0OiBbXCJAZW1vdGlvbi9zdHlsZWRcIiwgXCJkZWZhdWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlZEJhc2VJbXBvcnQ6IFtcIkBtdWkvc3lzdGVtXCIsIFwic3R5bGVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAbXVpL21hdGVyaWFsL3N0eWxlc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5vbmljYWxJbXBvcnQ6IFtcIkBlbW90aW9uL3N0eWxlZFwiLCBcImRlZmF1bHRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkQmFzZUltcG9ydDogW1wiQG11aS9tYXRlcmlhbC9zdHlsZXNcIiwgXCJzdHlsZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2xvYWRlci50c1wiKSxcbiAgICAgICAgICAgICAgICBpbmplY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYWx1ZXM6IGVudlZhcnNUb0xvYWQubWFwKChlbnZWYXJLZXkpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBlbnZWYXJLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gYCQke2VudlZhcktleX1gIDogcHJvY2Vzcy5lbnZbZW52VmFyS2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgICAgICAgIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5BRE1JTl9QT1JUKSxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICAvLyBkZWZpbmUgTk9ERV9FTlYgZm9yIHBhY2thZ2VzIHVzaW5nIGl0XG4gICAgICAgICAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gXCIncHJvZHVjdGlvbidcIiA6IFwiJ2RldmVsb3BtZW50J1wiLFxuICAgICAgICB9LFxuICAgICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgLy8gTm9kZS5qcyBnbG9iYWwgdG8gYnJvd3NlciBnbG9iYWxUaGlzLiBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvZGlzY3Vzc2lvbnMvNTkxMlxuICAgICAgICAgICAgICAgIC8vIFwiZ2xvYmFsIGlzIG5vdCBkZWZpbmVkXCIgb2NjdXJzIGRpcmVjdGx5IGFmdGVyIGxvYWRpbmcuIFVzZWQgYnkgZHJhZnQtaXMgcGFja2FnZVxuICAgICAgICAgICAgICAgIGRlZmluZToge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWw6IFwiZ2xvYmFsVGhpc1wiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5jbHVkZTogW1xuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2FkbWluXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4tcnRlXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4tZGF0ZS10aW1lXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4taWNvbnNcIixcbiAgICAgICAgICAgICAgICBcIkBjb21ldC9hZG1pbi10aGVtZVwiLFxuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2Ntcy1hZG1pblwiLFxuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2Jsb2Nrcy1hZG1pblwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICAgICBcIkBzcmNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgb3V0RGlyOiBcImJ1aWxkXCIsXG4gICAgICAgIH0sXG4gICAgfTtcbn0pOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FucnUvZGV2L2NvbWV0L2RlbW8vYWRtaW4vc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYW5ydS9kZXYvY29tZXQvZGVtby9hZG1pbi9zcmMvZW52aXJvbm1lbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FucnUvZGV2L2NvbWV0L2RlbW8vYWRtaW4vc3JjL2Vudmlyb25tZW50LnRzXCI7ZXhwb3J0IGNvbnN0IGVudmlyb25tZW50ID0gW1wiQVBJX1VSTFwiLCBcIkFETUlOX1VSTFwiLCBcIlNJVEVTX0NPTkZJR1wiLCBcIkNPTUVUX0RFTU9fQVBJX1VSTFwiLCBcIkJVSUxEX0RBVEVcIiwgXCJCVUlMRF9OVU1CRVJcIiwgXCJDT01NSVRfU0hBXCJdIGFzIGNvbnN0O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUixPQUFPLFdBQVc7QUFDdFMsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsd0JBQXdCOzs7QUNIb1EsSUFBTSxjQUFjLENBQUMsV0FBVyxhQUFhLGdCQUFnQixzQkFBc0IsY0FBYyxnQkFBZ0IsWUFBWTs7O0FEQWxhLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3RDLFNBQU87QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNMLE1BQU07QUFBQSxRQUNGLGlCQUFpQjtBQUFBLFFBQ2pCLFNBQVM7QUFBQSxVQUNMO0FBQUEsWUFDSTtBQUFBLFlBQ0E7QUFBQSxjQUNJLFdBQVc7QUFBQSxnQkFDUCxlQUFlO0FBQUEsa0JBQ1gsUUFBUTtBQUFBLG9CQUNKLGlCQUFpQixDQUFDLG1CQUFtQixTQUFTO0FBQUEsb0JBQzlDLGtCQUFrQixDQUFDLGVBQWUsUUFBUTtBQUFBLGtCQUM5QztBQUFBLGdCQUNKO0FBQUEsZ0JBQ0Esd0JBQXdCO0FBQUEsa0JBQ3BCLFFBQVE7QUFBQSxvQkFDSixpQkFBaUIsQ0FBQyxtQkFBbUIsU0FBUztBQUFBLG9CQUM5QyxrQkFBa0IsQ0FBQyx3QkFBd0IsUUFBUTtBQUFBLGtCQUN2RDtBQUFBLGdCQUNKO0FBQUEsY0FDSjtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsaUJBQWlCO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixPQUFPLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFFBQ3pDLFFBQVE7QUFBQSxVQUNKLE1BQU07QUFBQSxZQUNGLG1CQUFtQixZQUFjLElBQUksQ0FBQyxlQUFlO0FBQUEsY0FDakQsS0FBSztBQUFBLGNBQ0wsT0FBTyxTQUFTLGVBQWUsSUFBSSxTQUFTLEtBQUssUUFBUSxJQUFJLFNBQVM7QUFBQSxZQUMxRSxFQUFFO0FBQUEsVUFDTjtBQUFBLFFBQ0o7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixNQUFNLE9BQU8sUUFBUSxJQUFJLFVBQVU7QUFBQSxJQUN2QztBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFSix3QkFBd0IsU0FBUyxlQUFlLGlCQUFpQjtBQUFBLElBQ3JFO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDVixnQkFBZ0I7QUFBQTtBQUFBO0FBQUEsUUFHWixRQUFRO0FBQUEsVUFDSixRQUFRO0FBQUEsUUFDWjtBQUFBLE1BQ0o7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILFFBQVEsUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNKO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
