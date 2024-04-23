---
"@comet/cms-api": patch
---

Fix mutations `moveDamFiles`, `copyFilesToScope`, `archiveDamFiles` and `restoreDamFiles` by adding `@AffectedEntity` to enable scope checks
