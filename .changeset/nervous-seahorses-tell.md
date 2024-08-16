---
"@comet/admin": patch
---

Fix the behavior of `FinalFormRangeInput` when the `min` and `max` values are inverted

Previously, e.g., when the `min` value was changed to something greater than the `max` value, the `min` value would be set to the same as the max value.
Now, the `min` and `max` values are swapped.
