---
"@comet/cms-api": patch
---

Ignore user permissions when using system user

The `UserPermissionsGuard` didn't allow requests when using a system user (e.g., basic authorization during site build).
