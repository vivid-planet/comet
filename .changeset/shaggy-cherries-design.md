---
"@comet/cms-admin": minor
---

This change adds an optional content scope filter. This is useful if you have a very long list of different content scopes, that you cannot separate. To use it add 'searchable: true' to your ContentScopeProvider. (See how it is done in demo/admin/src/common/ContentScopeProvider.tsx)
