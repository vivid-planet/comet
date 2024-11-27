---
"@comet/blocks-admin": minor
---

Add `visibleOrderedBlocksForState` to `createCompositeBlocks` factory options base. The function should return an array of visible block keys for a given state. The blocks are returned in the order they should be rendered. If a block key is not present in the array, the block will not be rendered in the admin component.

Example usage:

- declare some kind of options, which contain a string array of visible blocks for each option:

```tsx
const layoutOptions = [
    {
        name: 'layout1',
        visibleBlocks: ['block1', 'block2', 'block3'],
    },
    {
        name: 'layout2',
        visibleBlocks: ['block4', 'block1', 'block2'],
    },
];
```

- return visible blocks for a given state in the `createCompositeBlocks` factory:

```tsx
visibleOrderedBlocksForState: (state: LayoutBlockData) => layoutOptions.find((option) => option.name === state.layout)?.visibleBlocks
```



