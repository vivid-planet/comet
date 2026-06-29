---
"@comet/brevo-api": patch
---

Fix fetching Brevo statistics

Fetching a Brevo campaign (and therefore its statistics) is broken in `@getbrevo/brevo` v3. Fix by temporarily downgrading to v2.
