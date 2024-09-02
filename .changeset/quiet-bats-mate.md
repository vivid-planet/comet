---
"@comet/admin": patch
---

Update required validator in `Field` to correctly handle falsey values

Previously, the validator incorrectly returned errors for all falsey values, e.g. the number `0`.
Now, it only returns an error for `undefined`, `null` and empty strings.
