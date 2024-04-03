---
"@comet/blocks-admin": minor
---

Add `minVisibleBlocks` option to `createListBlock` factory

This enables the possibility to enforce a minimum amount of blocks added to a list block. List blocks with less than the required amount of visible entries can't be saved.

**Example usage:**
```diff
export const SomeListBlock = createListBlock({
    // ...
+   minVisibleBlocks: 2,
});
```

