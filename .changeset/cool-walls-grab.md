---
"@comet/cms-api": minor
---

Add `createUserFromIdToken` to `UserService`-interface

This allows to override the default implementation of creating the User-Object from the JWT when logging in via `createAuthProxyJwtStrategy`
