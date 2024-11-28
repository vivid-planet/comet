---
"@comet/blocks-admin": minor
---

Add `hiddenForState` option to `createCompositeBlock`

This function can be used to hide a block in the `AdminComponent` for a given state.

**Example**

```tsx
const TextWithMediaVariantBlock = createCompositeBlock({
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
            // The media block isn't needed for the "text-only" variant
            hiddenForState: (state) => state.variant === "text-only",
        },
    },
});
```
