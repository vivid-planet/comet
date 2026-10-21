---
"@dextinity/cms-admin": minor
---

Render `TableBlock` with the data grid configured in `DextinityConfig`

`TableBlock` no longer needs `@mui/x-data-grid-pro`.
With the free `DataGrid`, rows and columns can only be moved with the menu items, not by dragging.

**Action required for drag-and-drop**

To keep drag-and-drop, configure the Pro or Premium grid:

```tsx
<DextinityConfigProvider dataGrid={{ component: DataGridPro }}>
```
