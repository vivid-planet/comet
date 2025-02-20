---
"@comet/cms-admin": major
---

Stay on same page when changing scopes

Previously, `redirectPathAfterChange` of `useContentScopeConfig` had to be explicitly set to ensure that the Admin stays on the same page after changing scopes.
This was often forgotten, resulting in redirects to the default page (usually the dashboard page).
Now, as it is the preferred behavior, the Admin will stay on the same page per default.

To upgrade, perform the following changes:

1. Remove the `path` prop from the `PagesPage` component
2. Remove the `redirectPathAfterChange` prop from the `RedirectsPage` component
3. Remove unnecessary usages of the `useContentScopeConfig` hook

To restore the previous behavior, add the `useContentScopeConfig` hook:

```tsx
import { useContentScopeConfig } from "@comet/cms-admin";

function MainMenuPage() {
    // We want to redirect to the dashboard page after changing the scope.
    useContentScopeConfig({ redirectPathAfterChange: "/dashboard" });
}
```
