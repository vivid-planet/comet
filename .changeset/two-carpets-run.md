---
"@comet/blocks-admin": minor
---

Add support for custom block categories

Minimal example:

```tsx
const MyBlock: BlockInterface = {
    category: {
        id: "Products",
        label: <FormattedMessage id="blocks.category.products" defaultMessage="Products" />,
        insertBefore: BlockCategory.Teaser,
    },
    ...
};
```

Use `insertBefore` to specify where the custom block category will be shown in the `AddBlockDrawer`.
