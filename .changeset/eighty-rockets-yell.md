---
"@comet/admin": major
---

Rename menu components

To better differentiate between imports from `@comet/admin` and `@mui/material`, the following components and related types have been renamed:

- `Menu` → `MainNavigation`
- `MenuProps` → `MainNavigationProps`
- `MenuClassKey` → `MainNavigationClassKey`
- `MenuItem` → `MainNavigationItem`
- `MenuItemProps` → `MainNavigationItemProps`
- `MenuItemClassKey` → `MainNavigationItemClassKey`
- `MenuCollapsibleItem` → `MainNavigationCollapsibleItem`
- `MenuCollapsibleItemProps` → `MainNavigationCollapsibleItemProps`
- `MenuCollapsibleItemClassKey` → `MainNavigationCollapsibleItemClassKey`
- `IWithMenu` → `WithMainNavigation`
- `withMenu` → `withMainNavigation`
- `MenuItemAnchorLink` → `MainNavigationItemAnchorLink`
- `MenuItemAnchorLinkProps` → `MainNavigationItemAnchorLinkProps`
- `MenuItemGroup` → `MainNavigationItemGroup`
- `MenuItemGroupClassKey` → `MainNavigationItemGroupClassKey`
- `MenuItemGroupProps` → `MainNavigationItemGroupProps`
- `MenuItemRouterLink` → `MainNavigationItemRouterLink`
- `MenuItemRouterLinkProps` → `MainNavigationItemRouterLinkProps`

Remove `MenuContext`, use the `useMainNavigation()` hook instead.
