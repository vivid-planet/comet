---
"@comet/cms-admin": patch
---

Consider all scope dimensions when automatically disabling grouping and matching the selected option in `ContentScopeSelect`

This solves two issues where for scopes with optional parts

-   the `ContentScopeSelect` switched between disabled and enabled grouping depending on the selected scope
-   the wrong selected scope was shown because the matching didn't consider all dimensions
