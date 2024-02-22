---
"@comet/cms-api": minor
---

Remove availablePermissions from UserPermissionsModule

Permission-interface and the availablePermissions-setting can simply be removed from the application. To use
an already existing permission from Comet `CometPermissions` can be imported.
