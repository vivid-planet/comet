---
"@comet/cms-api": patch
---

Fix in-memory filtering in `paginatedRedirects` query

- Fix `isEmpty` and `isNotEmpty` filters for string filters
- Fix boolean filter handling: properly handle the "any" case (when no specific value is set)
- Add support for `activatedAt` field in redirect filters
