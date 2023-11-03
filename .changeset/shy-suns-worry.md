---
"@comet/admin": patch
---

Fix the clear-button in `FinalFormSelect` when using it with the `multiple` prop.

-   The clear button is now only shown when at least one value is selected.
-   Clearing the value now sets it to an empty array instead of `undefined`, which would cause an error when trying to render the select.
