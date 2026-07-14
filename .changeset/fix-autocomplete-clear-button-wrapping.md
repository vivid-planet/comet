---
"@comet/admin": patch
---

Fix end adornment layout in multi-select `AutocompleteField`

Previously, the clear button could wrap below the chips and fall outside the visible field area in narrow containers.
Now the end adornment (loading indicator, clear button, error icon, popup icon) is pinned to the top right corner of the field and the input reserves exactly the required space for the currently visible adornments, so chips can never overlap it.
Additionally, the clear button is no longer shown for an empty multi-select, and clearing a multi-select now resets the value to an empty array instead of an empty string.
