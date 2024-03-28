---
"@comet/blocks-admin": minor
---

Add property `minVisibleBlocks` to `createListBlock` factory

This enables the possibility to enforce a minimum amount of blocks added to a list block. List blocks with less than the required amount of visible entries can't be saved.

**Example usage:**
```tsx
export const SomeListBlock = createListBlock({
    name: "SomeListBlock",
    block: SomeBlock,
    displayName: "Some List Block",
    itemName: "Some Item",
    itemsName: "Some Items",
    minVisibleBlocks: 2,
});
```

