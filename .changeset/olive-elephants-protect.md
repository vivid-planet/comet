---
"@comet/admin": major
---

Remove `DialogContent` from `EditDialog` as spacing inside a dialog is not always needed in the Comet DXP design

To maintain the existing styling of `EditDialog`, such as for forms and text, manually wrap the content with `DialogContent`. This ensures proper spacing.
For grids or other elements that already handle their own spacing (e.g., `DataGrid`), adding `DialogContent` is not necessary.

```diff
    <EditDialog>
    //...
+       <DialogContent>
+           //...
+       </DialogContent>
    // ...
    </EditDialog>
```
