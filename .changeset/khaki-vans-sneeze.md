---
"@comet/cms-api": minor
---

Rename `User` to `CometUser` in GraphQL schema

This prevents naming collisions if a web wants to use a `User` type.

Additionally prefix remaining user permissions-specific actions with `UserPermissions`.
