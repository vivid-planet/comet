---
"@comet/cms-admin": patch
---

Fix scope not switching when impersonating a user

Previously, the `ContentScopeProvider` blindly restored the scope from localStorage, which could redirect impersonated users to scopes they don't have access to.

Now, the stored scope is validated against the user's allowed scopes before being applied. If the stored scope is not allowed, it is cleared from localStorage and the default scope is used instead.

Additionally, the `NODE_ENV` guard on persisting the selected scope to localStorage is removed so scope persistence is also done locally again.
