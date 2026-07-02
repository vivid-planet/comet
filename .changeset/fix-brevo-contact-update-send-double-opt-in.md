---
"@comet/brevo-admin": patch
---

Fix `BrevoContactForm` sending `sendDoubleOptIn` in update mutation

`sendDoubleOptIn` is not a valid field of `BrevoContactUpdateInput` and only applies when creating a contact. The field was being included in the update payload because it was initialized in form state but not stripped out before the update mutation was called.
