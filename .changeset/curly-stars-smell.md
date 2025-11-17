---
"@comet/cms-api": minor
---

Log guard rejections

The following error now lead to a log output:

- CometAuthGuard can't authenticate the user
- CdnGuard does not receive correct header
- UserPermissionsGuard does not receive an authenticated user
- UserPermissionsGuard denies access due to insufficient permissions
