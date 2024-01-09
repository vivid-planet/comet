---
"@comet/cms-admin": patch
---

Improved the `EditPageNode` dialog ("Page Properties" dialog):

- Execute the asynchronous slug validation less often (increased the debounce wait time from 200ms to 500ms)
- Cache the slug validation results. Evict the cache on the initial render of the dialog