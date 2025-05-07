---
"@comet/admin": major
---

Prevent the selection of DataGrid rows by clicking on them

According to the Comet design guidelines, rows should be selected using checkboxes, with the `checkboxSelection` prop, where required.

```tsx
<DataGrid
    checkboxSelection
    onRowSelectionModelChange={(newRowSelectionModel) => {
        setRowSelectionModel(newRowSelectionModel);
    }}
    rowSelectionModel={rowSelectionModel}
    // ...
/>
```

To restore the previous behavior, set the `disableRowSelectionOnClick` prop to `false` in the individual `DataGrid` component or globally, using the theme's `defaultProps`.

```tsx
<DataGrid
    disableRowSelectionOnClick
    // ...
/>
```

```tsx
const theme = createCometTheme({
    components: {
        MuiDataGrid: {
            defaultProps: {
                disableRowSelectionOnClick: false,
            },
        },
    },
});
```
