---
"@comet/admin": patch
---

Fix end-adornment (clear button, popup icon) wrapping below chips in multi-select `AutocompleteField` / `AsyncAutocompleteField`

In narrow containers, the end-adornment could be pushed to a new flex line by selected chips (either one long chip or multiple chips filling the input row), rendering it outside or below the visible input area. Chips now wrap inside their own inner flex container, while the outer input row stays on a single no-wrap line — so the end-adornment always sits on the right and grows naturally to fit its content (loading, clear, error, popup icon).
