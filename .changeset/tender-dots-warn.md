---
"@comet/admin": major
---

Remove the `paper` class-key from `FilterBarPopoverFilter`

Instead of using `styleOverrides` for `paper` in the theme, use the `slotProps` and `sx` props.
