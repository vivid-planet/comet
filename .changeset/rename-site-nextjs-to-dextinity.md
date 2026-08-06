---
"@dextinity/site-nextjs": major
---

Rename `@comet/site-nextjs` to `@dextinity/site-nextjs`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the `cometType` property of iframe messages to `dextinityType`. A matching `@dextinity/cms-admin` version is required
- Rename the site preview cookie from `__comet_site_preview` to `__dextinity_site_preview`. A matching `@dextinity/cms-api` version is required
