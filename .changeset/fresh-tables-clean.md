---
"@comet/cms-api": patch
---

Call `createUserFromRequest` before `createUserFromIdToken`

The latter is marked as deprecated and should only be used if the
first one is not defined.
