---
"@comet/cms-api": minor
---

Add `registerAdditionalPermissions` helper

The helper can be used register additional permissions into the permission enum used for the GraphQL schema.
Only use this if you're building a library that requires additional permissions.
For application-level permissions, use the `AppPermission` option in the module registration methods.
