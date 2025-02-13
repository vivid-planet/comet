---
"@comet/admin": major
---

Remove `DialogContent` from `EditDialog`

Add `DialogContent` as child of `EditDialog`.

```diff
    <EditDialog>
    //...
+       <DialogContent>
+          /...
+       </DialogContent>
     // ...
    </EditDialog>
```
