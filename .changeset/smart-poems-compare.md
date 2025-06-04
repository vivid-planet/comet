---
"@comet/admin": patch
---

Revert "Prevent form components used within `Field`/`FieldContainer` from overflowing their parent" introduced in v7.20.0

This change caused the BlocksBlock to break when rendering it inside a `Field`.
