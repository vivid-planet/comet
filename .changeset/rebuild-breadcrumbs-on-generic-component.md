---
"@comet/admin": minor
---

Rebuild `StackBreadcrumbs` and `ToolbarBreadcrumbs` on top of the shared `Breadcrumbs` component

Both components now delegate rendering to the shared responsive `Breadcrumbs` component instead of maintaining their own markup. This unifies their look and behavior (desktop overflow menu, mobile page-tree menu) and adds SPA navigation to the mobile menu, which previously reloaded the page.

Their top-level props are unchanged: `StackBreadcrumbs` still accepts `separator` and `overflowLinkText`, `ToolbarBreadcrumbs` still accepts `iconMapping`.

**New props on `Breadcrumbs`**

- `linkComponent` – component used to render the navigable breadcrumb links (defaults to a plain anchor). Pass a router-aware component to enable SPA navigation.
- `startAdornment` – rendered before the trail, e.g. a back button or scope indicator. On mobile it sits outside the menu-toggle button.
- `overflowLabel` – label of the overflow ellipsis (defaults to `". . ."`).

**Theming migration**

Because `StackBreadcrumbs` and `ToolbarBreadcrumbs` now render the `Breadcrumbs` markup, their `slotProps` and theme `styleOverrides` use the `Breadcrumbs` slots (`root`, `startAdornment`, `item`, `activeItem`, `separator`, `ellipsis`, `overflowButton`, `overflowMenu`, `overflowMenuItem`, `menuContainer`, `toolbarContainer`, `expandedMenu`, `expandedMenuItem`, `expandedMenuActiveItem`, `expandedMenuActiveItemWrapper`, `expandedMenuSubitemWrapper`, `pageTreeVerticalLine`, `mobileMenuIcon`, `mobileRootButton`). `StackBreadcrumbs` additionally keeps its `backButton` and `backButtonSeparator` slots for the back button.

The previous, component-specific class keys no longer apply and need to be migrated:

- `StackBreadcrumbs`: `root`, `breadcrumbs`, `listItem`, `link`, `disabledLink`, `overflowLink`, `separator`
- `ToolbarBreadcrumbs`: `breadcrumbsList`, `mobileBreadcrumbsButton`, `currentBreadcrumbsItem`, `breadcrumbsItem`, `mobileStandaloneCurrentBreadcrumbItem`, `breadcrumbsItemSeparator`, `breadcrumbsEllipsisItem`, `mobileMenu`, `mobileMenuIcon`, `mobileMenuItem`, `mobileMenuItemText`, `mobileMenuItemNestingIndicator`
