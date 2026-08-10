---
"@dextinity/cms-api": patch
---

Improve performance of the `contentScopesCount` field when querying the users list

When resolving `contentScopesCount` for a list of users, the available content scopes were recomputed (and deduplicated) once per row. They are now resolved a single time per request through a request-scoped `DataLoader`, which noticeably speeds up the users list when many content scopes are configured.
