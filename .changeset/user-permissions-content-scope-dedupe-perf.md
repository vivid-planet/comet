---
"@comet/cms-api": patch
---

Improve performance when querying the users list with many available content scopes

When resolving the `contentScopesCount` field for a list of users, the available content scopes were recomputed and deduplicated once per row. They are now resolved a single time per request via a request-scoped `DataLoader`.

The deduplication itself was also sped up: it no longer relies on `lodash.uniqWith` (which does a deep-equal comparison against every previously seen scope, i.e. O(n²)) but builds a lookup key per scope instead. With 2000 content scopes this reduces the deduplication from about 15 seconds to about 0.15 seconds.
