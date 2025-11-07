---
"@comet/cms-api": minor
---

Add support for scope-specific site preview secrets

The `sitePreviewSecret` in `PageTreeModule` now accepts a function `(scope: ContentScope) => string` to use different secrets based on the current content scope.
