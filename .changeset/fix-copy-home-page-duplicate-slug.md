---
"@comet/cms-api": patch
---

Fix copying the home page creating a second page with the slug `home`

Previously, copying the home page produced a second page with the slug `home`, after which none of the home pages could be deleted (deleting a page with the slug `home` is forbidden). The copy now receives a different slug if the target scope already has a home page, and keeps `home` only when there is none yet.
