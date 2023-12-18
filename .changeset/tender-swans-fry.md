---
"@comet/admin": patch
---

Fix `shouldScrollTo()`, `shouldShowError()` and `shouldShowWarning()` in `Field`

Previously, the `meta` argument was passed to these methods incorrectly. Now, the argument is passed as defined by the typing.