---
"@comet/admin": minor
---

Add `helperIcon` prop to MenuItemGroup. Its intended purpose is to render an icon with a `Tooltip` behind the group section title, if the menu is not collapsed.

### Examples:

**Render only an icon:**

```tsx
<MenuItemGroup title="Group Title" helperIcon={<QuestionMark />}>
    {/* ... */}
</MenuItemGroup>
```

**Render an icon with tooltip:**

```tsx
<MenuItemGroup
    title="Group Title"
    helperIcon={
        <Tooltip title="Some help text">
            <QuestionMark />
        </Tooltip>
    }
>
    {/* ... */}
</MenuItemGroup>
```
