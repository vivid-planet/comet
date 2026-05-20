---
"@comet/admin": minor
"@comet/cms-admin": minor
---

Add `NotFound` page and propagate it to nested navigation

A new `NotFound` component is rendered in `MasterMenuRoutes` for unmatched top-level routes. The same fallback now also applies to nested navigation: `StackSwitch`, `RouterTabs` and `BlockAdminTabs` render the configured `NotFound` instead of silently falling back to the initial page or default tab when the URL points to an unknown sub-route. The DAM file edit page renders `NotFound` when the file ID is invalid or missing (previously a small "Failed to load file" message).

`@comet/admin` exposes a new `NotFoundProvider` and `useNotFound` hook so projects can configure a custom fallback for nested routes. `MasterMenuRoutes` sets the provider automatically, so cms-admin projects pick this up without any change.

**Custom fallback**

```tsx
<MasterMenuRoutes menu={menu} fallback={<MyCustomNotFound />} />
```
