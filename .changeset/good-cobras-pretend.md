---
"@comet/admin": minor
---

Adjust how tooltips are triggered

This is to achieve a more consistent and user-friendly experience by ensuring tooltips are always shown when the user interacts with the underlying element.

-   When using the default `hover` trigger, tooltips will now be shown on both `hover` and `focus`. Previously, you had to choose between `hover` and `focus`.
-   The `trigger` prop is deprecated and will be removed in a future major version. The combined `hover`/`focus` trigger will be the only supported behavior.
-   Tooltips on touch devices will be shown immediately when the user starts interacting with the underlying element.
