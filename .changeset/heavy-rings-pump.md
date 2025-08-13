---
"@comet/admin-generator": patch
---

Fix generated `ToolbarProps` for `excelExport`-only case

When generating `ToolbarProps` with `forwardToolbarAction = false` and `excelExport = true`, the generator previously inserted `false` into the generated interface, causing invalid TypeScript output.

**Example broken output**

```ts
interface BooksGridToolbarToolbarProps extends GridToolbarProps {
    false;
    exportApi: ExportApi;
}
```
