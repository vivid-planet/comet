---
"@comet/admin": patch
---

Fix end-adornment (clear button, popup icon) wrapping below chips in multi-select `AutocompleteField` / `AsyncAutocompleteField`

In narrow containers, the end-adornment could be pushed to a new flex line by selected chips (either one long chip or multiple chips filling the input row), rendering it outside or below the visible input area. The adornment is now absolutely positioned and space for it is reserved via `padding-right` on the input root.
