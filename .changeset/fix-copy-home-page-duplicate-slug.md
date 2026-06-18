---
"@comet/cms-api": patch
---

Fix copying the home page creating a second page with the slug `home`

The copy now receives a different slug if the target scope already has a home page, and keeps `home` only when there is none yet.
