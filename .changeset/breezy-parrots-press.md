---
"@comet/admin": patch
---

Adapt styling of `DateTimePicker` on mobile devices to improve readability of the placeholder

Return `null` for `ClearInputAdornment` if there is no content to be cleared. This avoids overlapping placeholders in the field.
