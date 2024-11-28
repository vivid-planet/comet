---
"@comet/blocks-admin": minor
---

Add `visibleOrderedBlocksForState` option to `createCompositeBlock`

The option can be used to hide and order child blocks in the `AdminComponent`.
It should return an array of visible block keys for a given state.
The order of the keys define the order in which the blocks will be rendered.
If key is not present in the array, the block will not be rendered.

**Example**

```tsx
const LayoutBlock = createCompositeBlock({
    /* ... */
    blocks: {
        layout: {
            /* A layout select */
        },
        headline1: { block: HeadlineBlock },
        image1: { block: DamImageBlock },
        headline2: { block: HeadlineBlock },
        image2: { block: DamImageBlock },
    },
    visibleOrderedBlocksForState: (state: LayoutBlockData) => {
        if (state.layout === "compact") {
            // headline2 and image2 will be hidden
            return ["headline1", "image1"];
        } else {
            return ["headline1", "image1", "headline2", "image2"];
        }
    },
});
```
