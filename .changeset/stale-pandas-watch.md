---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Fix validation of redirect source path

Previously, the currently edited redirect wasn't excluded in the `RedirectSourceAvailable` check.
This meant that the redirect couldn't be saved without changing the redirect source path.

Now, the currently edited redirect is excluded from the `RedirectSourceAvailable` check.
