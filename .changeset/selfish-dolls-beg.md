---
"@comet/cms-site": minor
---

Add new technique for blocks to load additional data at page level when using SSR

This works both server-side (SSR, SSG) and client-side (block preview).

New Apis:

- `recursivelyLoadBlockData`: used to call loaders for a block data tree
- `BlockLoader`: type of a loader function that is responsible for one block
- `useBlockPreviewFetch`: helper hook for block preview that creates client-side caching graphQLFetch/fetch
