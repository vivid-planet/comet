---
"@comet/admin": patch
---

Prevent unintended `width: 100%` on nested `InputBase` components inside `FieldContainer` and `Field` components

`FieldContainer` (and therefore `Field`) needs to set the with of the `InputBase` it wraps to 100%.
This also caused deeply nested `InputBase` components, e.g., inside a `Dialog`, to get this `width` and break the styling of these components, as they are not intended to be styled by `FieldContainer`.
