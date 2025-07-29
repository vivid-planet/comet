---
title: How to work with usePreview
---

Sometimes the block preview needs to adapt to a user's interactions.
For instance, an accordion item should open in the preview when the user hovers over the respective item in the block's admin component.
This behavior can be achieved by using the `usePreview` hook:

```tsx
const { previewType, showPreviewSkeletons, isSelected, isHovered } = usePreview();
```

The hook returns an object with the following properties:

- `previewType` indicates which preview is currently active, e.g., the site preview
- `showPreviewSkeletons` indicates if the currently active preview shows preview skeletons
- `isSelected` is used to check whether the block is currently selected in the admin
- `isHovered` is used to check whether the block is currently hovered in the admin

These properties can now be used to open accordion items based on the user's interactions:

```diff title="AccordionBlock.tsx"
export const AccordionBlock = withPreview(
    ({ data }: AccordionBlockProps) => {
        const [expandedItems, setExpandedItems] = useState<string[]>([]);
        const { previewType, isSelected, isHovered } = usePreview();

+       useEffect(() => {
+           if (previewType === "BlockPreview") {
+               const focusedBlock = data.blocks.find((block) => {
+                   if (!isWithPreviewPropsData(block)) {
+                       return false;
+                   }
+
+                   const url = block.adminMeta?.route;
+
+                   return (
+                       url &&
+                       (isSelected(url, { exactMatch: false }) ||
+                           isHovered(url, { exactMatch: false }))
+                   );
+               });
+
+               if (focusedBlock) {
+                   setExpandedItems([focusedBlock]);
+               } else {
+                   setExpandedItems([]);
+               }
+           }
+       }, [previewType, data.blocks, isSelected, isHovered]);

        return (
            <Root>
                {data.blocks.map((block) => (
                    <AccordionItemBlock
                        key={block.key}
                        data={block.props}
                        onChange={() => handleChange(block.key)}
                        isExpanded={expandedItems.includes(block.key)}
                    />
                ))}
            </Root>
        );
    },
    { label: "Accordion" },
);
```

Let's break this down into smaller steps:

First, check whether the block is in the block preview:

```tsx
useEffect(() => {
    if (previewType === "BlockPreview") {
        // The block is in the block preview!
    }
}, [previewType, data.blocks, isSelected, isHovered]);
```

Next, check if an item is focused by comparing the current route in the admin with the item's admin route.
The item's admin route is stored in `adminMeta`:

```tsx
const focusedBlock = data.blocks.find((block) => {
    if (!isWithPreviewPropsData(block)) {
        return false;
    }

    const url = block.adminMeta?.route;

    return url && (isSelected(url, { exactMatch: false }) || isHovered(url, { exactMatch: false }));
});
```

The `isWithPreviewPropsData` function is a [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to tell TypeScript that the item has the `adminMeta` property.

:::tip

Set the `exactMatch` option to `false` to keep the accordion item open even when the user navigates further into the item's admin component.

:::

Finally, update the block's state based on whether an item is focused:

```tsx
if (focusedBlock) {
    setExpandedItems([focusedBlock]);
} else {
    setExpandedItems([]);
}
```
