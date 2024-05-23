---
"@comet/cms-admin": patch
---

Fix link target validation in `ExternalLinkBlock`

Previously, two different validation checks were used.
This resulted in an error when saving an invalid link target but no error message was shown.
