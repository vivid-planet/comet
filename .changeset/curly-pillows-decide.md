---
"@comet/admin": minor
---

Add new `DataGridToolbar` component

The "normal" `Toolbar` is meant to be used on page-level to show the current scope, breadcrumbs and page-wide action buttons (like save).
The `DataGridToolbar`, however, is meant to be used in DataGrids to contain a search input, filter options, bulk actions and an add button.

You can use it like this:

```tsx
<DataGrid
    // ...
    components={{
        Toolbar: () => (
            <DataGridToolbar>
                {/* ... */}
            </DataGridToolbar>
        ),
    }}
/>
```