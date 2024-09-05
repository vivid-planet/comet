---
"@comet/admin": patch
---

Fix validation for `NumberField` and `FinalFormNumberInput` by calling the `onBlur` event, passed in by the `Field`
