---
"@comet/cms-api": minor
---

Migrate internal user lookups off the deprecated `getUser`

The user-permissions resolvers and `UserPermissionsService.getImpersonatedUser` now use `getUserService().findUserOrThrow()` / `findUser()` instead of the deprecated `getUser` method. The deprecated `getUser` and `getUserForLogin` methods are removed from `UserPermissionsService` (the internal service is not re-exported, so this does not affect public consumers). The corresponding deprecated methods on `UserPermissionsUserServiceInterface` remain for back-compat and will be removed in v10.
