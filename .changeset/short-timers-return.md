---
"@comet/cms-site": minor
"@comet/cms-api": minor
---

Use more generic resolver to support prelogin

-   `@comet/cms-api`: Provide a `currentUser` field resolver `permissionsForScope` instead the `isAllowedSitePreview`-query.
-   `@comet/cms-site`: Export `getValidatedScope` for use in API-Route
