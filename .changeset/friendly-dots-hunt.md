---
"@comet/blocks-admin": minor
---

Add `hiddenForState` to `createCompositeBlock`. This allows you to hide a block based on the state of another block.
For example, you can hide a block if another block is empty, or if it has a specific value. This can be useful in many scenarios, like hiding a block for a specific variant of the block, when an attribute is not needed.

```tsx
createCompositeBlock({
    name: "TextWithMediaVariant",
    blocks: {
        variant: {
            block: createCompositeBlockSelectField<string>({
                defaultValue: "text-image",
                fieldProps: { label: "Variant", fullWidth: true },
                options: [
                    { value: "text-image", label: "Text Image" },
                    { value: "text-only", label: "Text Only" },
                ],
            }),
        },
        text: {
            block: RichTextBlock,
        },
        media: {
            block: MediaBlock,
            hiddenForState: (state) => state.variant === "text-only",
        },
    },
});
```
