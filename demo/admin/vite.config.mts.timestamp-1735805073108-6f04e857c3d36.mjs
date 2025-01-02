// vite.config.mts
import react from "file:///Users/juliawegmayr/Documents/comet/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_@swc+helpers@0.5.5_vite@5.1.8_@types+node@22.9.0_terser@5.36.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { defineConfig } from "file:///Users/juliawegmayr/Documents/comet/node_modules/.pnpm/vite@5.1.8_@types+node@22.9.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
import { createHtmlPlugin } from "file:///Users/juliawegmayr/Documents/comet/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.1.8_@types+node@22.9.0_terser@5.36.0_/node_modules/vite-plugin-html/dist/index.mjs";

// src/environment.ts
var environment = ["API_URL", "ADMIN_URL", "PUBLIC_SITE_CONFIGS", "COMET_DEMO_API_URL", "BUILD_DATE", "BUILD_NUMBER", "COMMIT_SHA"];

// vite.config.mts
var __vite_injected_original_dirname = "/Users/juliawegmayr/Documents/comet/demo/admin";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInNyYy9lbnZpcm9ubWVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qdWxpYXdlZ21heXIvRG9jdW1lbnRzL2NvbWV0L2RlbW8vYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qdWxpYXdlZ21heXIvRG9jdW1lbnRzL2NvbWV0L2RlbW8vYWRtaW4vdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qdWxpYXdlZ21heXIvRG9jdW1lbnRzL2NvbWV0L2RlbW8vYWRtaW4vdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xuXG5pbXBvcnQgeyBlbnZpcm9ubWVudCBhcyBlbnZWYXJzVG9Mb2FkIH0gZnJvbSBcIi4vc3JjL2Vudmlyb25tZW50XCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgcmVhY3Qoe1xuICAgICAgICAgICAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJAc3djL3BsdWdpbi1lbW90aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0TWFwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQG11aS9zeXN0ZW1cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2Fub25pY2FsSW1wb3J0OiBbXCJAZW1vdGlvbi9zdHlsZWRcIiwgXCJkZWZhdWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlZEJhc2VJbXBvcnQ6IFtcIkBtdWkvc3lzdGVtXCIsIFwic3R5bGVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJAbXVpL21hdGVyaWFsL3N0eWxlc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5vbmljYWxJbXBvcnQ6IFtcIkBlbW90aW9uL3N0eWxlZFwiLCBcImRlZmF1bHRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVkQmFzZUltcG9ydDogW1wiQG11aS9tYXRlcmlhbC9zdHlsZXNcIiwgXCJzdHlsZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2xvYWRlci50c1wiKSxcbiAgICAgICAgICAgICAgICBpbmplY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYWx1ZXM6IGVudlZhcnNUb0xvYWQubWFwKChlbnZWYXJLZXkpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBlbnZWYXJLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gYCQke2VudlZhcktleX1gIDogcHJvY2Vzcy5lbnZbZW52VmFyS2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHNlcnZlcjoge1xuICAgICAgICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgICAgICAgIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5BRE1JTl9QT1JUKSxcbiAgICAgICAgfSxcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICAvLyBkZWZpbmUgTk9ERV9FTlYgZm9yIHBhY2thZ2VzIHVzaW5nIGl0XG4gICAgICAgICAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiID8gXCIncHJvZHVjdGlvbidcIiA6IFwiJ2RldmVsb3BtZW50J1wiLFxuICAgICAgICB9LFxuICAgICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgLy8gTm9kZS5qcyBnbG9iYWwgdG8gYnJvd3NlciBnbG9iYWxUaGlzLiBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvZGlzY3Vzc2lvbnMvNTkxMlxuICAgICAgICAgICAgICAgIC8vIFwiZ2xvYmFsIGlzIG5vdCBkZWZpbmVkXCIgb2NjdXJzIGRpcmVjdGx5IGFmdGVyIGxvYWRpbmcuIFVzZWQgYnkgZHJhZnQtaXMgcGFja2FnZVxuICAgICAgICAgICAgICAgIGRlZmluZToge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWw6IFwiZ2xvYmFsVGhpc1wiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5jbHVkZTogW1xuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2FkbWluXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4tcnRlXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4tZGF0ZS10aW1lXCIsXG4gICAgICAgICAgICAgICAgXCJAY29tZXQvYWRtaW4taWNvbnNcIixcbiAgICAgICAgICAgICAgICBcIkBjb21ldC9hZG1pbi10aGVtZVwiLFxuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2Ntcy1hZG1pblwiLFxuICAgICAgICAgICAgICAgIFwiQGNvbWV0L2Jsb2Nrcy1hZG1pblwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICAgICBcIkBzcmNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgb3V0RGlyOiBcImJ1aWxkXCIsXG4gICAgICAgIH0sXG4gICAgfTtcbn0pOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2p1bGlhd2VnbWF5ci9Eb2N1bWVudHMvY29tZXQvZGVtby9hZG1pbi9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9qdWxpYXdlZ21heXIvRG9jdW1lbnRzL2NvbWV0L2RlbW8vYWRtaW4vc3JjL2Vudmlyb25tZW50LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9qdWxpYXdlZ21heXIvRG9jdW1lbnRzL2NvbWV0L2RlbW8vYWRtaW4vc3JjL2Vudmlyb25tZW50LnRzXCI7ZXhwb3J0IGNvbnN0IGVudmlyb25tZW50ID0gW1wiQVBJX1VSTFwiLCBcIkFETUlOX1VSTFwiLCBcIlBVQkxJQ19TSVRFX0NPTkZJR1NcIiwgXCJDT01FVF9ERU1PX0FQSV9VUkxcIiwgXCJCVUlMRF9EQVRFXCIsIFwiQlVJTERfTlVNQkVSXCIsIFwiQ09NTUlUX1NIQVwiXSBhcyBjb25zdDtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFQsT0FBTyxXQUFXO0FBQ2hWLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHdCQUF3Qjs7O0FDSDhTLElBQU0sY0FBYyxDQUFDLFdBQVcsYUFBYSx1QkFBdUIsc0JBQXNCLGNBQWMsZ0JBQWdCLFlBQVk7OztBREFuZCxJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxTQUFPO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDTCxNQUFNO0FBQUEsUUFDRixpQkFBaUI7QUFBQSxRQUNqQixTQUFTO0FBQUEsVUFDTDtBQUFBLFlBQ0k7QUFBQSxZQUNBO0FBQUEsY0FDSSxXQUFXO0FBQUEsZ0JBQ1AsZUFBZTtBQUFBLGtCQUNYLFFBQVE7QUFBQSxvQkFDSixpQkFBaUIsQ0FBQyxtQkFBbUIsU0FBUztBQUFBLG9CQUM5QyxrQkFBa0IsQ0FBQyxlQUFlLFFBQVE7QUFBQSxrQkFDOUM7QUFBQSxnQkFDSjtBQUFBLGdCQUNBLHdCQUF3QjtBQUFBLGtCQUNwQixRQUFRO0FBQUEsb0JBQ0osaUJBQWlCLENBQUMsbUJBQW1CLFNBQVM7QUFBQSxvQkFDOUMsa0JBQWtCLENBQUMsd0JBQXdCLFFBQVE7QUFBQSxrQkFDdkQ7QUFBQSxnQkFDSjtBQUFBLGNBQ0o7QUFBQSxZQUNKO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELGlCQUFpQjtBQUFBLFFBQ2IsUUFBUTtBQUFBLFFBQ1IsT0FBTyxRQUFRLGtDQUFXLGVBQWU7QUFBQSxRQUN6QyxRQUFRO0FBQUEsVUFDSixNQUFNO0FBQUEsWUFDRixtQkFBbUIsWUFBYyxJQUFJLENBQUMsZUFBZTtBQUFBLGNBQ2pELEtBQUs7QUFBQSxjQUNMLE9BQU8sU0FBUyxlQUFlLElBQUksU0FBUyxLQUFLLFFBQVEsSUFBSSxTQUFTO0FBQUEsWUFDMUUsRUFBRTtBQUFBLFVBQ047QUFBQSxRQUNKO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sTUFBTSxPQUFPLFFBQVEsSUFBSSxVQUFVO0FBQUEsSUFDdkM7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRUosd0JBQXdCLFNBQVMsZUFBZSxpQkFBaUI7QUFBQSxJQUNyRTtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1YsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBLFFBR1osUUFBUTtBQUFBLFVBQ0osUUFBUTtBQUFBLFFBQ1o7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDTDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDSCxRQUFRLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDSjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0gsUUFBUTtBQUFBLElBQ1o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
