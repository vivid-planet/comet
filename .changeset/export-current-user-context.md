---
"@comet/cms-admin": patch
---

Export `CurrentUserContext` from `@comet/cms-admin`

`CurrentUserContext` is now exported so that consumers can directly access the React context. This is needed for use cases such as providing a custom implementation of the context (e.g. in tests or in applications that manage their own user context) and for components that need to consume the context directly rather than through the `useCurrentUser` hook.
