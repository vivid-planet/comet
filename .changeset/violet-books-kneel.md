---
"@comet/admin": minor
---

Make it easier to render DataGrid cell content based on the cell's `valueOptions`

Objects inside a cell's `valueOptions` now support an optional `cellContent` property to allow defining a react node in addition to the `label`, which can only be a string.

When using the new `renderStaticSelectCell` helper as the `renderCell` function in the column definition, the helper will render the `cellContent` node of the selected option if defined.
The `label` or the string value of the option will be used as the cell's content if no `cellContent` node is provided.

The following example would behave as follows:

-   If the cell's value is "Shirt", it will render the `cellContent` node (the H2 Typography)
-   If the cell's value is "Cap", it will render the `label` (the string "This Cap")
-   If the cell's value is anything else, it will render the value as a string, e.g. "Tie"

```tsx
{
    headerName: "Category",
    field: "category",
    valueOptions: [
        {
            value: "Shirt",
            label: "Shirt"
            cellContent: (
                <Typography variant="h2">
                    A Shirt
                </Typography>
            ),
        },
        {
            value: "Cap",
            label: "This Cap",
        },
        "Tie",
    ],
    renderCell: renderStaticSelectCell,
}
```
