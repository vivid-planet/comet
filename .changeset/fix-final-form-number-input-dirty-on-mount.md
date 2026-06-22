---
"@comet/admin": patch
---

Fix `FinalFormNumberInput` dirtying the form on mount when the initial value is `null`

The value-sync effect inside `FinalFormNumberInput` ran on mount and called `input.onChange(undefined)` whenever `input.value` was empty. For a form whose initial value was `null`, this silently normalized the value to `undefined`, making the field `dirty` before any user interaction and breaking dirty-tracking features such as `EditDialog`, `SaveBoundary`, and the unsaved-changes router prompt.

The mount-time sync now only updates the formatted display string. The empty-input normalization to `undefined` still happens on real user interaction in `handleBlur`.
