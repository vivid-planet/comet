---
"@comet/admin": major
---

Rework `Toolbar`

-   The `Toolbar` is now split into a top and a bottom bar.

    The top bar displays a scope indicator and breadcrumbs. The bottom bar behaves like the old `Toolbar`.

-   The styling of `Toolbar`, `ToolbarItem`, `ToolbarActions`, `ToolbarAutomaticTitleItem` and `ToolbarBackButton` was adjusted

-   The new `ToolbarActionButton` should be used for buttons inside the `ToolbarActions`

    It automatically switches from a normal `Button` to an `IconButton` for smaller screen sizes.

-   To show a scope indicator, you must pass a `<ContentScopeIndicator />` to the `Toolbar` via the `scopeIndicator` prop

