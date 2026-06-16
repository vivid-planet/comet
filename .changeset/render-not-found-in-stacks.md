---
"@comet/admin": minor
"@comet/cms-admin": minor
---

Render NotFound for unknown sub-pages in `StackSwitch`. Adds `NotFoundProvider`
and `useNotFound` to `@comet/admin`; `MasterMenuRoutes` wires the provider so
cms-admin projects pick this up automatically.
