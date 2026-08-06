---
"@comet/cms-api": patch
---

Count each permission only once in the `permissionsCount` of a user

A permission that is granted both by rule and manually was counted twice, so the permissions count shown for a user in the admin could exceed the number of available permissions. It now counts distinct permissions.
