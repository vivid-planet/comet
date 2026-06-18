---
"@comet/brevo-api": minor
---

Update `@getbrevo/brevo` to v5

The Brevo Node.js SDK v5 is a ground-up rewrite based on a unified client architecture. Instead of instantiating one API class per resource and authenticating each with `setApiKey`, a single `BrevoClient` is now created per scope and exposes all resources (e.g. `client.contacts`, `client.transactionalEmails`).

The transactional mail service's `send` method now accepts a `SendTransacEmailRequest` (without `sender`) instead of a `SendSmtpEmail`. The commonly used fields (`to`, `subject`, `htmlContent`, `textContent`) are unchanged, so existing calls continue to work.
