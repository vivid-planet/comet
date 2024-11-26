---
"@comet/admin": patch
---

Fix the `fullHeight` behavior of `MainContent`

When used inside certain elements, e.g. with `position: relative`, the height would be calculated incorrectly.
