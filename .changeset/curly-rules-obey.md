---
"@comet/cms-api": patch
---

Only regenerate warnings for the row that changed in the `WarningEventSubscriber`

Previously, the warnings were regenerated for all rows of the entity using a lot of memory.
