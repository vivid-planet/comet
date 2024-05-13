---
"@comet/cms-api": patch
---

Only return duplicates within the same scope in the `FilesResolver#duplicates` field resolver

As a side effect `FilesService#findAllByHash` now accepts an optional scope parameter.
