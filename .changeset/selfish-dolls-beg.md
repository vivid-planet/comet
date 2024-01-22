---
"@comet/cms-site": minor
---

Add new technique for blocks to load additional data at page level when using SSR

This works both server-side (SSR, SSG) and client-side (block preview).

New functions:

- `registerBlock`: allows registering a loader for a named block
- `recursivelyLoadBlockData`: can be used to call those loaders for a block data tree
