---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Redirect to edit page after adding a redirect

Previously, the use wasn't redirected to the edit page after creating a new redirect.
This caused strange validation errors and made it impossible to edit the redirect after creating it.
