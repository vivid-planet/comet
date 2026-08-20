---
"@comet/cms-api": patch
---

Improve performance of content scope deduplication in `UserPermissionsService`

Replace `lodash.uniqWith` (deep-equal, O(n²)) with a custom `Map`-based deduplication that keys content scopes by their sorted entries. Deduplicating large content scope lists is now dramatically faster (e.g. 2000 scopes: from ~15 s down to ~0.15 s), and the `lodash.uniqwith` dependency is removed.
