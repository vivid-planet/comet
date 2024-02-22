---
"@comet/cms-api": minor
---

Deprecate `availablePermissions`-option in `UserPermissionsModule`

Simply remove the `Permission` interface module augmentation and the `availablePermissions`-option from the application.
If you wan to use a permission defined by Comet, for instance, `"pageTree"` for a document type resolver, you may use the exported `cometPermissions` object.
