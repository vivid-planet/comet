---
"@comet/admin": minor
---

Add props `helperText` and `helperIcon` to MenuItemGroup. It renders an icon with a Tooltip behind the group section title, if the menu is not collapsed. If only a `helperText` is defined the icon `QuestionMark` will be used as default. If only `helperIcon` is defined the icon will be rendered without the Tooltip.

### Examples:
**Show helper text in a tooltip with default icon:**
```tsx
<MenuItemGroup
  title="Group Title"
  helperText="Helper Text"
>
      {/* ... */}
</MenuItemGroup>
```
**Show only a custom icon:**
```tsx
<MenuItemGroup
    title="Group Title"
    helperIcon={<QuestionMark />}
>
    {/* ... */}
</MenuItemGroup>
```
**Show a custom icon with the helper text in a tooltip:**
```tsx
<MenuItemGroup
    title="Group Title"
    helperText="Helper Text"
    helperIcon={<QuestionMark />}
>
    {/* ... */}
</MenuItemGroup>
```
