---
"@comet/admin": major
---

FinalForm: remove default `onAfterSubmit` implementation

In most cases the default implementation is not needed anymore. When upgrading, an empty
function override of `onAfterSubmit` can be removed as it is not necessary any longer.
