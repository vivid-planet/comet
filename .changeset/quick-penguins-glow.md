---
"@comet/cms-api": patch
---

Treat `null` and `undefined` scope dimensions the same in `AccessControlService#isAllowed`

Optional scope dimensions may sometimes be `null` or `undefined` depending on how the scope object is created.
For instance, when the scope is loaded from the database, the optional dimension will be `null`, but when the scope is coming from GraphQL, the dimension can be `undefined`.
Due to strict equality comparison, this led to incorrect access control checks in `AccessControlService#isAllowed`.
This is now prevented by treating `null` and `undefined` dimensions as the same when checking the scope.
