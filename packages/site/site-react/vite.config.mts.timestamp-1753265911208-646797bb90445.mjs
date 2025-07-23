// vite.config.mts
import react from "file:///Users/franz/dev/comet/comet-v8/node_modules/.pnpm/@vitejs+plugin-react@4.6.0_vite@5.4.19_@types+node@22.16.3_sass@1.89.2_terser@5.36.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import preserveDirectives from "file:///Users/franz/dev/comet/comet-v8/node_modules/.pnpm/rollup-plugin-preserve-directives@0.4.0_rollup@4.44.2/node_modules/rollup-plugin-preserve-directives/dist/index.js";
import { defineConfig } from "file:///Users/franz/dev/comet/comet-v8/node_modules/.pnpm/vite@5.4.19_@types+node@22.16.3_sass@1.89.2_terser@5.36.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/franz/dev/comet/comet-v8/node_modules/.pnpm/vite-plugin-dts@4.5.4_@types+node@22.16.3_rollup@4.44.2_typescript@5.7.3_vite@5.4.19_@t_437218a0914adaa1a0e21aa7bcf48565/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.build.json" })
    // generates the types for the library
  ],
  build: {
    outDir: "lib",
    lib: {
      entry: "./src/index.ts",
      fileName: () => "index.js",
      formats: ["es"]
    },
    rollupOptions: {
      plugins: [preserveDirectives()],
      // is necessary to preserve "use client" at top of file
      external: (source) => {
        return !source.startsWith(".") && !source.startsWith("/");
      },
      output: {
        // these options are necessary to prevent bundling everything in one file (doesn't work with client components)
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js"
      }
    },
    minify: "terser"
    // Minifies the output for production
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2ZyYW56L2Rldi9jb21ldC9jb21ldC12OC9wYWNrYWdlcy9zaXRlL3NpdGUtcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9mcmFuei9kZXYvY29tZXQvY29tZXQtdjgvcGFja2FnZXMvc2l0ZS9zaXRlLXJlYWN0L3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZnJhbnovZGV2L2NvbWV0L2NvbWV0LXY4L3BhY2thZ2VzL3NpdGUvc2l0ZS1yZWFjdC92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgcHJlc2VydmVEaXJlY3RpdmVzIGZyb20gXCJyb2xsdXAtcGx1Z2luLXByZXNlcnZlLWRpcmVjdGl2ZXNcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHJlYWN0KCksXG4gICAgICAgIGR0cyh7IHRzY29uZmlnUGF0aDogXCIuL3RzY29uZmlnLmJ1aWxkLmpzb25cIiB9KSwgLy8gZ2VuZXJhdGVzIHRoZSB0eXBlcyBmb3IgdGhlIGxpYnJhcnlcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIG91dERpcjogXCJsaWJcIixcbiAgICAgICAgbGliOiB7XG4gICAgICAgICAgICBlbnRyeTogXCIuL3NyYy9pbmRleC50c1wiLFxuICAgICAgICAgICAgZmlsZU5hbWU6ICgpID0+IFwiaW5kZXguanNcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgICAgICB9LFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbcHJlc2VydmVEaXJlY3RpdmVzKCldLCAvLyBpcyBuZWNlc3NhcnkgdG8gcHJlc2VydmUgXCJ1c2UgY2xpZW50XCIgYXQgdG9wIG9mIGZpbGVcbiAgICAgICAgICAgIGV4dGVybmFsOiAoc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBuZWNlc3NhcnkgdG8gdHJlYXQgYWxsIG5wbSBwYWNrYWdlcyBhcyBleHRlcm5hbCxcbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2Ugdml0ZSB3aWxsIGJ1bmRsZSB0aGVtIGludG8gdGhlIGxpYnJhcnkgd2hpY2ggY2F1c2VkIGlzc3VlcyB3aXRoIGNsaWVudCAvIHNlcnZlciBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgLy8gc3VwcG9zZWRseSBiZWNhdXNlIHNlcnZlciBjb2RlIHdhcyBidW5kbGVkIGludG8gdGhlIGNsaWVudCBjb2RlXG4gICAgICAgICAgICAgICAgcmV0dXJuICFzb3VyY2Uuc3RhcnRzV2l0aChcIi5cIikgJiYgIXNvdXJjZS5zdGFydHNXaXRoKFwiL1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICAvLyB0aGVzZSBvcHRpb25zIGFyZSBuZWNlc3NhcnkgdG8gcHJldmVudCBidW5kbGluZyBldmVyeXRoaW5nIGluIG9uZSBmaWxlIChkb2Vzbid0IHdvcmsgd2l0aCBjbGllbnQgY29tcG9uZW50cylcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogXCJzcmNcIixcbiAgICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG1pbmlmeTogXCJ0ZXJzZXJcIiwgLy8gTWluaWZpZXMgdGhlIG91dHB1dCBmb3IgcHJvZHVjdGlvblxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsT0FBTyxXQUFXO0FBQzlXLE9BQU8sd0JBQXdCO0FBQy9CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUVoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixJQUFJLEVBQUUsY0FBYyx3QkFBd0IsQ0FBQztBQUFBO0FBQUEsRUFDakQ7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNELE9BQU87QUFBQSxNQUNQLFVBQVUsTUFBTTtBQUFBLE1BQ2hCLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDbEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNYLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztBQUFBO0FBQUEsTUFDOUIsVUFBVSxDQUFDLFdBQVc7QUFJbEIsZUFBTyxDQUFDLE9BQU8sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLFdBQVcsR0FBRztBQUFBLE1BQzVEO0FBQUEsTUFDQSxRQUFRO0FBQUE7QUFBQSxRQUVKLGlCQUFpQjtBQUFBLFFBQ2pCLHFCQUFxQjtBQUFBLFFBQ3JCLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsRUFDWjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
