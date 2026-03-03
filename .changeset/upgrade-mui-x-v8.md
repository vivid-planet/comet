---
"@comet/admin": minor
"@comet/cms-admin": minor
"@comet/brevo-admin": minor
"@comet/admin-generator": minor
---

Upgrade MUI X from v7 to v8

Breaking changes applied:

- `AdapterDateFnsV3` renamed to `AdapterDateFns`
- `GridPinnedColumns` renamed to `GridPinnedColumnFields`
- `GridApiCommunity` renamed to `GridApi`
- `MuiPickersPopper` theme key renamed to `MuiPickerPopper`
- `GridPreferencePanelsValue` now includes `aiAssistant`
- `GridRowSelectionModel` changed from `GridRowId[]` to `{ type: 'include' | 'exclude'; ids: Set<GridRowId> }`
- Date picker generic `<Date, true>` removed (TDate generic no longer needed)
- `SingleInputDateRangeField` is now the default for range pickers
- `GridToolbarQuickFilter` `placeholder` prop moved to `slotProps.root.placeholder`
- Deep imports from `@mui/x-data-grid/models/*` and `@mui/x-data-grid/components/*` no longer resolve; use main package exports or `@mui/x-data-grid/internals`
- `deepClone` from `@mui/x-data-grid/utils/utils` replaced with native `structuredClone`
- `theme.mixins.MuiDataGrid.containerBackground` moved to `theme.palette.DataGrid.bg/headerBg/pinnedBg`
