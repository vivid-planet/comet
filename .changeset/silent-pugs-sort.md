---
"@comet/admin": patch
---

`title` prop of the Dialog got merged with `title` Prop of `MuiDialogProps`. This lead to errors when forwarding ReactNodes to title.
