---
"@comet/cms-site": major
"@comet/cms-api": major
---

Protect images in site preview

The image urls in the site preview are now generated as preview-urls. Authorization is handled
via the new `createSitePreviewAuthService` which validates the cookie of the site preview.
