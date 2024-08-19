---
"@comet/cms-api": minor
---

Support `isAdmin`-Flag in `User`-interface

If the (optional) `isAdmin`-field of the `User` returns true the user automatically gets all rights. There is no need anymore to add this kind of checks into the `AccessControlService`. Moreover, the same behavior can be accomplished by overriding the `isAdmin`-method of the service.
