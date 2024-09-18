---
"@comet/cms-admin": minor
"@comet/admin": minor
---

Add support for `badgeContent` prop in `MenuItemRouterLink`

**Example usage in `masterMenuData`:**

```ts
const masterMenuData = [
    // ...
    {
        type: "route",
        primary: "Some Route",
        to: "/someRoute",
        badgeContent: 2,
    },
    // ...
];
```

**Example usage as element:**

```tsx
<MenuItemRouterLink primary="Some Route" to="/someRoute" badgeContent={2} />
```
