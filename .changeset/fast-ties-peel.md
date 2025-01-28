---
"@comet/cms-site": minor
---

Extend the `usePreview`-helpers `isSelected` and `isHovered` with optional partial match support

-   When `exactMatch` is set to `true` (default), the function checks for exact URL matches.
-   When `exactMatch` is set to `false`, the function checks if the selected route starts with the given URL.
