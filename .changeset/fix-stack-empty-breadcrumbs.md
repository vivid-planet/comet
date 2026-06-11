---
"@comet/admin": patch
---

Fix `Stack` crash when location changes before any breadcrumb is registered

`Stack` accessed the last entry of an empty breadcrumb array on location change, causing a `TypeError: Cannot set properties of undefined`. Guarded the update to skip when no breadcrumbs are registered yet.
