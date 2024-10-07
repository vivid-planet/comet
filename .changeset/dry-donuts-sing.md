---
"@comet/cms-admin": patch
---

Fix validation of empty `PhoneLinkBlock`

Previously, the default phone value was an empty string, meaning `@IsOptional()` didn't prevent validation.
Since an empty string is not a valid phone number, the validation failed.

This change sets the default value to `undefined`.
