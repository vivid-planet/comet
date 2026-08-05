---
"@comet/admin": patch
---

Fix selected value rendering underneath the end adornment in `SelectField`

Previously, the select reserved a fixed amount of space for the end adornment, which was too small when more than the clear button was rendered (e.g., an error icon).
Now the reserved space is measured, so long values are always truncated before the first adornment icon.
