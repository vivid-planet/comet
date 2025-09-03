---
"@comet/admin": patch
---

Fix props of `Tooltip`'s `slotProps.popper` when setting custom values

When setting custom values to `slotProps.popper`, some default props would unintentionally be reset.
