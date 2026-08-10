---
"@dextinity/cms-admin": patch
---

Open the `Permissions` tab by default when editing a user in the `UserPermissionsPage`

Selecting a user now opens the `Permissions` tab instead of `Basic Data`, while the tab order stays unchanged. Users without the `userPermissions` permission (who don't see the `Permissions` tab) continue to open the `Basic Data` tab.
