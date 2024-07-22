---
"@comet/admin": minor
---

Add `MenuItemGroup` component to group menu items

**Example:**

```tsx
<MenuItemGroup title="Some item group title">
    <MenuItemRouterLink primary="Menu item 1" icon={<Settings />} to="/menu-item-1" />
    <MenuItemRouterLink primary="Menu item 2" icon={<Settings />} to="/menu-item-2" />
    <MenuItemRouterLink primary="Menu item 3" icon={<Settings />} to="/menu-item-3" />
    {/* Some more menu items... */}
</MenuItemGroup>
```
