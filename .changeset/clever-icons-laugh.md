---
"@comet/admin": major
---

New usage of `DataGridToolbar` component

`DataGridToolbar` has been simplified to a basic wrapper component. Props and features from the standard `Toolbar` component have been removed, along with the `density` prop since density is now controlled by the `DataGrid`.

The new usage simplifies the component structure - children can now be passed directly without needing to wrap them in `ToolbarItem` and `ToolbarActions` components:

```diff
- <DataGridToolbar density="compact">
+ <DataGridToolbar>
-     <ToolbarItem>
          <GridToolbarQuickFilter />
-     </ToolbarItem>
-     <ToolbarItem>
          <GridFilterButton />
-     </ToolbarItem>
-     <ToolbarItem>
          <GridColumnsButton />
-     </ToolbarItem>
      <FillSpace />
-     <ToolbarActions>
          <Button responsive variant="outlined">
              Secondary action
          </Button>
          <Button responsive startIcon={<AddIcon />}>
              Add item
          </Button>
-     </ToolbarActions>
  </DataGridToolbar>
```
