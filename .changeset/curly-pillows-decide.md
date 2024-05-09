---
"@comet/admin": minor
---

Add new `DataGridToolbar` component

You can use it like this:

```tsx
<DataGrid
    // ...
    components={{
        Toolbar: () => (
            <DataGridToolbar>
                {/* // ... */}
            </DataGridToolbar>
        ),
    }}
/>
```