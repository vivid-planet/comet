---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Show reason why impersonation is not possible

Add `impersonationNotAllowedByPermissions: [UserPermissionsPermissionMismatch!]!` field to `UserPermissionsUser` alongside the existing `impersonationAllowed: Boolean!` field. The new field returns the list of missing permissions and content scopes that prevent impersonation.

Add `getPermissionMismatches` static method to `AbstractAccessControlService` that returns `PermissionMismatch[]` instead of a boolean. The existing `isEqualOrMorePermissions` method now delegates to `getPermissionMismatches`.

The admin UI uses `impersonationAllowed` for the initial check and only queries `impersonationNotAllowedByPermissions` on demand when the user clicks the question mark icon next to a disabled impersonation action, opening a dialog with the details.
