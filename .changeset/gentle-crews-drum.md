---
"@comet/admin": patch
---

Allow customizing `CrudContextMenu`

Customize existing parts of `CrudContextMenu` using the `slotProps`, `iconMapping` and `messagesMapping` props.
Add custom actions by adding instances of `RowActionsItem` to the `children`:

```tsx
<CrudContextMenu
// ...
>
    <RowActionsItem
        icon={<Favorite />}
        onClick={() => {
            // Do something
        }}
    >
        Custom action
    </RowActionsItem>
    <Divider />
</CrudContextMenu>
```
