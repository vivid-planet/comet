---
"@comet/cms-api": minor
---

Add option `shouldInvokeUserService` to `createJwtAuthService`

Sometimes it is preferred to load the user from the `UserService` instead of using the data from the ID-Token (e.g. because the `UserService` provides additional data). This options allows to force this behavior.
