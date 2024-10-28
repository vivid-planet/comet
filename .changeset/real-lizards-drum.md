---
"@comet/cms-api": patch
---

DAM: Fix/set cache-control headers

-   Public endpoints should cache files for 1 day
-   Private endpoints should cache files for 1 year - but only in local caches (not CDN)
