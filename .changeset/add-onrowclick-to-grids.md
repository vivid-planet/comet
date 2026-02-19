---
"@comet/admin-generator": minor
---

Add automatic `onRowClick` navigation to generated grids

Generated grids now automatically navigate to the edit page when a row is clicked, improving user experience.

- When `rowActionProp` is `false` (default): generates a `handleRowClick` handler using `useStackSwitchApi().activatePage("edit", id)`
- When `rowActionProp` is `true`: adds an optional `onRowClick` prop to allow parent components to override the default behavior

**Example (rowActionProp: false)**

Generated grids include automatic navigation:

```tsx
const stackSwitchApi = useStackSwitchApi();
const handleRowClick: DataGridProProps["onRowClick"] = (params) => {
    stackSwitchApi.activatePage("edit", params.row.id);
};

<DataGridPro {...props} onRowClick={handleRowClick} />;
```

**Example (rowActionProp: true)**

Parent components can provide custom click handlers:

```tsx
<ProductsGrid
    onRowClick={(params) => {
        stackSwitchApi.activatePage("edit", params.row.id);
    }}
/>
```
