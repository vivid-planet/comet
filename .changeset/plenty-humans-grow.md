---
"@comet/cms-api": minor
---

Remove `CurrentUserLoader` and `CurrentUserInterface`

Overriding the the current user in the application isn't supported anymore when using the new `UserPermissionsModule`, which provides the current user DTO itself.
