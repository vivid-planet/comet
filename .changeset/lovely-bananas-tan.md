---
"@comet/admin": patch
---

Fix `FieldContainer` layout on first render

Previously, `FieldContainer` displayed vertically on desktop instead of horizontally due to the container width not being available during the first render (because `ref.current` was null).
The layout corrected itself after interacting with the field, triggering a rerender.

Now, the rerender is triggered automatically when `ref.current` is set resulting in the correct layout from the start.
