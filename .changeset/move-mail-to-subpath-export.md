---
"@comet/cms-api": major
---

Move mail exports to dedicated `@comet/cms-api/mail` subpath export

`MailerModule`, `MailTemplatesModule`, and related mail exports (`MailerService`, `MailTemplate`, `MailTemplateInterface`, `MailTemplateService`, `MailerLog`, `MailerModuleConfig`, `SendMailParams`, `PreparedTestProps`, `MAILER_SERVICE_CONFIG`) are no longer available from `@comet/cms-api`. Import them from `@comet/cms-api/mail` instead.

**Example migration**

```diff
- import { MailerModule, MailTemplatesModule } from "@comet/cms-api";
+ import { MailerModule, MailTemplatesModule } from "@comet/cms-api/mail";
```
