---
"@comet/cms-admin": minor
"@comet/cms-site": minor
"@comet/cms-api": minor
---

Create site preview JWT in the API

With this change the site preview can be deployed unprotected. Authentication is made via a JWT created in the API and validated in the site. A separate domain for the site preview is still necessary.

**Note:** This requires the `sitePreviewSecret` option to be configured in the `PageTreeModule`.
Run `npx @comet/upgrade@latest v7/add-site-preview-secret.ts` in the root of your project to perform the necessary code changes.
Changes to the deployment setup might still be necessary.
