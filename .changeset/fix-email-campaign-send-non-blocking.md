---
"@comet/brevo-api": patch
---

Fix 502 Bad Gateway on email campaign send by making `sendBrevoEmailCampaignNow` non-blocking. The mutation now immediately sets the campaign state to `SCHEDULED` and returns, while the actual send runs in the background. A new `FAILED` sending state is added to track campaigns that failed to send.
