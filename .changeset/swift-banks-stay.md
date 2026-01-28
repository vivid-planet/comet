---
"@comet/cms-api": minor
---

`MailerService.sendMail()` now automatically creates a plaintext version from the HTML content

When the params passed to `sendMail()` do not include a `text` property but do include a `html` property, a plaintext version will be automatically generated based on the HTML content.
