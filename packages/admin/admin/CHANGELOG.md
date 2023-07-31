# @comet/admin

## 4.3.0

### Patch Changes

-   @comet/admin-icons@4.3.0

## 4.2.0

### Minor Changes

-   3567533e: Add componentsProps to EditDialog
-   d25a7cbb: Allow disabling `RowActionsItem` using a `disabled` prop.

### Patch Changes

-   67e54a82: Add styling variants to Tooltip
-   7b614c13: Add styleOverrides to ToolbarAutomaticTitleItem
-   aaf1586c: Fix multiple prop in FinalFormAutocomplete
    -   @comet/admin-icons@4.2.0

## 4.1.0

### Minor Changes

-   51466b1a: Add initial sort to `useDataGridRemote` hook
-   51466b1a: Add optional prop `disableCloseAfterSubmit` to `EditDialog`. It prevents the default closing behavior of `EditDialog`.
-   51466b1a: Add optional prop `onAfterSave()` to `EditDialog`. It is called after successfully saving a `FinalForm` within the `EditDialog`
-   51466b1a: Added `RowActionsMenu` and `RowActionsItem` components for creating IconButtons with nested Menus and Items for actions in table rows and other listed items.
-   c5f2f918: Add Tooltip Component that adds to MUI Tooltip a trigger prop that allows showing the Tooltip on focus/click without the need for `ClickAwayListener`.

### Patch Changes

-   51466b1a: Add compatible x-data-grid-\* versions as optional peerDependency
-   Updated dependencies [51466b1a]
    -   @comet/admin-icons@4.1.0
