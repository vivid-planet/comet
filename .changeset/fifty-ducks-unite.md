---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Allow setting labels for user permissions admin panel

- Support labels in `availableContentScopes`
  It now possible to use the following format (the same like for `ContentScopeSelect` in the admin):
    ```ts
    availableContentScopes: [
        {
            domain: {
                value: "main",
                label: "MAIN",
            },
            language: {
                value: "en",
                label: "English",
            },
        },
        // ...,
    ];
    ```
- Add `permissionLabels` prop to `UserPermissionsPage`
