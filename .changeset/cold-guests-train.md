---
"@comet/cms-admin": minor
"@comet/cms-site": minor
"@comet/cms-api": minor
---

Create site preview JWT in the API

With this change the site preview can be deployed unprotected. Authentication is made via a JWT created in the API and validated in the site. A separate domain for the site preview is still necessary.

BREAKING: this update of Comet v7 requires to have set sitePreviewSecret (which has to be the same value like possibly already set for site). Please refer to https://github.com/vivid-planet/comet-starter/pull/371 for more information on how to upgrade.
