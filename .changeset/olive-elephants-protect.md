---
"@comet/admin": major
---

Remove `DialogContent` from `EditDialog` as spacing inside a dialog is not commonly needed in the Comet DXP design

To maintain the current styling of `EditDialog`, add `DialogContent` as a child.

```diff
    <EditDialog>
    //...
+       <DialogContent>
+          //...
+       </DialogContent>
     // ...
    </EditDialog>
```
