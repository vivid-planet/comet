---
"@comet/cms-api": patch
---

Log the reason when a permission check denies access

`AbstractAccessControlService.isEqualOrMorePermissions` now emits a NestJS `Logger.debug` line identifying the missing permission or content scope whenever it returns `false`. The `impersonationAllowed` resolver field additionally logs when a user attempts to impersonate themselves.
