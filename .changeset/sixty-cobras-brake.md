---
"@comet/cms-api": major
---

Replace ContentScopeModule with UserPermissionsModule

Breaking changes:

-   ContentScope-Module has been removed
-   canAccessScope has been moved to AccessControlService
-   role- and rights-fields has been removed from CurrentUser-Object
-   AllowForRole-decorator has been removed

Upgrade-Guide: tbd
