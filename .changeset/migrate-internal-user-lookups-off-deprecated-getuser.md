---
"@comet/cms-api": minor
---

Rename `UserPermissionsService.getUser` / `getUserForLogin` to `findUserOrThrow` / `findUserForLoginOrThrow`

The proxy methods on `UserPermissionsService` are renamed to align with the new `findUser`/`findUserOrThrow` API on `UserPermissionsUserServiceInterface`. Both proxies fall back to the deprecated `userService.getUser` / `getUserForLogin` to preserve back-compat for consumers that haven't migrated their user service yet.

Internal callers (`user.resolver`, `user-permission.resolver`, `user-content-scopes.resolver`, `getImpersonatedUser`) are updated to use the new method names.
