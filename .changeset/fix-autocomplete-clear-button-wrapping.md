---
"@comet/admin": patch
---

Fix clear button wrapping outside container in multi-select `AutocompleteField` with long chip labels

In narrow containers, a selected chip with a long label could push the clear button to a new flex line, rendering it outside the visible input area.
