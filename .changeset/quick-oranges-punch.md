---
"@comet/cms-api": patch
---

Sort the keys in content scopes returned by `UserPermissionsService` alphabetically

This fixes issues when comparing content scopes after converting them to strings via `JSON.stringify()`.

This specifically fixes a bug on the UserPermissionsPage:
When the `availableContentScopes` passed to the `UserPermissionsModule` weren't sorted alphabetically, the allowed scopes wouldn't be displayed correctly in the UI.
