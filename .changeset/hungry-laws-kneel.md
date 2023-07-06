---
"@comet/cms-admin": patch
---

Disable the DAM license feature per default.

The form fields to add license information to assets are now hidden per default. License warnings are not shown per default.
Setting the `enableLicenseFeature` option via the DamConfigProvider is now necessary to show the license fields and warnings.