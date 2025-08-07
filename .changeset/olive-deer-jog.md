---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Make impersonation usable for non root users.

If activated, impersonation is only available if the impersonating user
has as many or fewer permissions and content scopes as the user to impersonate.
Since this is an expensive calculation the button to impersonate is only
available in the detail view of the user and has been removed from the list
view.

When enabling the `impersonation` permission for non root users the
permission should also be added to `requiredPermission` for
`UserPermissionsPage`. This enables the user to select the user to impersonate.
Nevertheless, without the `userPermissions` permission it's not possible to
change permission of users.
