---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Changed format for `useCurrentUser().allowedContentScopes`

- Old: `{ [key]: string }[]`
- New: `{ scope: ContentScope; label: { [key in keyof ContentScope]: string }; }[]`

To support a smooth transition the `defaultValue` prop of the `ContentScopeProvider` now must also have the same format.
