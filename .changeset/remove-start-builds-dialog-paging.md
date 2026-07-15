---
"@comet/cms-admin": patch
---

Remove pagination from `StartBuildsDialog` data grid

The `buildTemplates` query always returns all templates, so the page-based pagination in the dialog grid was misleading. All templates are now displayed at once.
