---
"@comet/cms-api": patch
---

Return null in `getNodeByPath` when path is `/home` to prevent the home page from being returned for that path (results in 404)
