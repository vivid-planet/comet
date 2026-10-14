---
"@dextinity/cli": patch
---

Fix `dextinity inject-site-configs` failing with `ERR_MODULE_NOT_FOUND` in projects without a `tsconfig.json`

Without a `tsconfig.json`, `ts-node` falls back to the defaults of `@tsconfig/node16`, which switched to `module: Node16` in version 1.0.4.
This caused `ts-node` to emit ESM, so extensionless imports in the site configs (e.g., `import main from "./main"`) could no longer be resolved.
The CLI now always compiles to CommonJS.
