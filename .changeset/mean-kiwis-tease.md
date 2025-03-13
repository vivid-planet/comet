---
"@comet/cms-site": major
"@comet/cms-api": major
---

Protect images in the site preview

The image URLs in the site preview are now generated as preview URLs.
Authorization is handled via the new `createSitePreviewAuthService`, which validates the site preview cookie.
