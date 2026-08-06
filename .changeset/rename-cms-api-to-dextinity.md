---
"@dextinity/cms-api": major
---

Rename `@comet/cms-api` to `@dextinity/cms-api`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename `CometException` and its subclasses: `CometValidationException` -> `DextinityValidationException`, `CometEntityNotFoundException` -> `DextinityEntityNotFoundException`, `CometImageResolutionException` -> `DextinityImageResolutionException`. The error codes returned by the API change accordingly, so a matching `@dextinity/cms-admin` version is required
- Rename `CometAuthGuard` to `DextinityAuthGuard` and the `@DisableCometGuards()` decorator to `@DisableDextinityGuards()`
- Rename the database tables `CometFileUpload`, `CometUserPermission` and `CometUserContentScopes` to `DextinityFileUpload`, `DextinityUserPermission` and `DextinityUserContentScopes`. A migration is shipped with the package, so running the migrations is sufficient
- Rename the site preview cookie from `__comet_site_preview` to `__dextinity_site_preview` and the impersonation cookie from `comet-impersonate-user-id` to `dextinity-impersonate-user-id`
