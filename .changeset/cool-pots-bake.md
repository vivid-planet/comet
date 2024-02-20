---
"@comet/cms-api": minor
---

Allow a callback for the `availableContentScopes`-option of the `UserPermissionsModule`

Please be aware that when using this possibility to make sure to cache the
response properly as this is called for every request to the API.
