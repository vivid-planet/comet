import { defineConfig } from "tsdown";
import pluginBabel from "@rollup/plugin-babel";
import { esmExternalRequirePlugin } from 'rolldown/plugins';

export default defineConfig({
    platform: "browser",
    unbundle: true,
    
    
    /* plugins: [pluginBabel({ babelHelpers: "bundled" }),

         esmExternalRequirePlugin({
      external: ['react'],
    }),
    ], */
});
