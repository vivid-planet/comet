---
"@comet/cms-admin": patch
---

Fix false positives in `resolveHasSaveConflict` check

The check occasionally failed due to rounding errors.
This is fixed by rounding to full seconds before checking.
