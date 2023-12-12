---
"@comet/cms-site": minor
---

Add technique for block to load additional data at page level when using SSR

This works server side (SSR, SSG) and client side (block preview).

new functions:

- registerBlock: allows registering a loader for a named block
- recursivelyLoadBlockData: can be used to call those loaders for a block data tree
