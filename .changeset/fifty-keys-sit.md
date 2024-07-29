---
"@comet/cms-admin": major
---

Replace the `ContentScopeIndicator` with a new version intended for use in the new `Toolbar`

The old `ContentScopeIndicator` was a purely cosmetic component. Hence, the logic for displaying the current scope had to be implemented in the project (usually in a project-internal `ContentScopeIndicator` component).

The new `ContentScopeIndicator` has the logic for displaying the current scope built-in. Thus, you can remove your project's `ContentScopeIndicator` implementation and directly use the `ContentScopeIndicator` from this library.

Usage:

-   Per default, the `ContentScopeIndicator` displays the current `ContentScope`
-   Pass a scope object via the `scope` prop if your page has a custom scope
-   Pass the `global` prop if your page has no scope
-   Pass `children` if you want to render completely custom content
