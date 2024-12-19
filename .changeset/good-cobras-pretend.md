---
"@comet/admin": minor
---

Show tooltips on both `hover` and `focus` when using the default `hover` trigger and deprecate the `trigger` prop

This was done to achieve consistent behavior across elements and ensure tooltips are always shown before the user interacts with the underlying element.
The `trigger` prop will be removed in a future major version, with the combined `hover`/`focus` trigger becoming the only supported behavior.
