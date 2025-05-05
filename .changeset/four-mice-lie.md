---
"@comet/admin": patch
---

Prevent form components used within `Field`/`FieldContainer` from overflowing their parent

Select components now truncate their value with ellipsis when used within these components, consistent with their behavior in other usages.
