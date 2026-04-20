---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Show reason why impersonation is not possible

Replace `impersonationAllowed: Boolean!` with `impersonationNotAllowedByPermissions: [UserPermissionsPermissionMismatch!]!` on `UserPermissionsUser`. The new field returns the list of missing permissions and content scopes that prevent impersonation, allowing the admin UI to display why impersonation is not possible (e.g., "Missing permissions: XY").

Add `getPermissionMismatches` static method to `AbstractAccessControlService` that returns `PermissionMismatch[]` instead of a boolean. The existing `isEqualOrMorePermissions` method is deprecated and now delegates to `getPermissionMismatches`.

**Migration Guide**

If you query `impersonationAllowed` on `UserPermissionsUser`, replace it with `impersonationNotAllowedByPermissions`:

```graphql
# Before
query {
    user: userPermissionsUserById(id: $id) {
        impersonationAllowed
    }
}

# After
query {
    user: userPermissionsUserById(id: $id) {
        impersonationNotAllowedByPermissions {
            permission
            missingContentScopes
        }
    }
}
```

An empty array means impersonation is allowed. A non-empty array contains the permission mismatches preventing impersonation.

If you use `AbstractAccessControlService.isEqualOrMorePermissions`, migrate to `getPermissionMismatches`:

```typescript
// Before
const allowed = AbstractAccessControlService.isEqualOrMorePermissions(userPermissions, targetPermissions);

// After
const mismatches = AbstractAccessControlService.getPermissionMismatches(userPermissions, targetPermissions);
const allowed = mismatches.length === 0;
```
