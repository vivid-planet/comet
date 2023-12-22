---
"@comet/cms-api": major
---

Remove license types `MICRO` and `SUBSCRIPTION`

The `LicenseType` enum no longer contains the values `MICRO` and `SUBSCRIPTION`. The database migration will automatically update all licenses of type `MICRO` or `SUBSCRIPTION` to `RIGHTS_MANAGED`.