---
"@dextinity/cms-admin": major
---

Rename `@comet/cms-admin` to `@dextinity/cms-admin`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename `CometConfigProvider` to `DextinityConfigProvider`, `useCometConfig` to `useDextinityConfig` and the `CometConfig` type to `DextinityConfig`. By convention, the project's `comet-config.json` is renamed to `dextinity-config.json`
- Rename the `cometType` property of iframe messages to `dextinityType`. The site must use a matching `@dextinity/site-react` or `@dextinity/site-nextjs` version
- Rename the site preview cookie from `__comet_site_preview` to `__dextinity_site_preview` and the impersonation cookie from `comet-impersonate-user-id` to `dextinity-impersonate-user-id`
- Expect the renamed `DextinityImageResolutionException` and `DextinityValidationException` error codes in DAM file uploads. A matching `@dextinity/cms-api` version is required
- Rename the theme component prefix from `CometAdmin` to `DextinityAdmin`. This affects `components` overrides passed to `createDextinityTheme` and the generated CSS class names
- Rename the CSS variables from `--comet-admin-*` to `--dextinity-admin-*`
- Replace the Comet logo in the header, the about modal and the site preview with the Dextinity logo
