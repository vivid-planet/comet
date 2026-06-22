---
"@comet/brevo-api": major
---

Update `@getbrevo/brevo` to v5

The transactional mail service's `send` method now accepts a `SendTransacEmailRequest` (without `sender`) instead of a `SendSmtpEmail`. The commonly used fields (`to`, `subject`, `htmlContent`, `textContent`) are unchanged, so existing calls continue to work.
