---
"@comet/cms-api": minor
---

Rename `MailerModule` config options for clarity

`sendAllMailsTo` is renamed to `redirectAllMailsTo` and `sendAllMailsBcc` is renamed to `bccAllMailsTo`. The old options still work but are deprecated.

- `redirectAllMailsTo`: If set, all outgoing mails are redirected to these addresses instead of being delivered to the original recipients. BCCs configured via `bccAllMailsTo` are also redirected. Use case: Disable mail delivery to real customers in non-production environments.
- `bccAllMailsTo`: If set, every outgoing mail receives an additional BCC to these addresses. Ignored when `redirectAllMailsTo` is set. Use case: In production, keep a safety copy of every outgoing mail.
