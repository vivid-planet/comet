---
"@comet/admin": minor
---

Add support for custom components to `CrudMoreActionsMenu`

**Example**

```tsx
const CustomAction = () => (
    <CrudMoreActionsMenuItem
        onClick={() => {
            // Perform action
        }}
    >
        <ListItemIcon>
            <Favorite />
        </ListItemIcon>
        Custom Action
    </CrudMoreActionsMenuItem>
);

<CrudMoreActionsMenu overallActions={[<CustomAction key="custom-action" />]} />;
```

**Note:** Use the `CrudMoreActionsMenuItem` component or `CrudMoreActionsMenuContext` to close the menu after clicking an item.
