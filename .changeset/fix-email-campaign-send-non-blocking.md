---
"@comet/brevo-api": minor
"@comet/brevo-admin": minor
---

Add `FAILED` sending state and make `sendEmailCampaignNow` non-blocking.

`sendEmailCampaignNow` now returns immediately after setting the campaign state to `SCHEDULED`; the actual Brevo send pipeline runs in the background using a forked `EntityManager`. If sending fails (or no eligible target groups exist), the campaign state is set to `FAILED`. Failed campaigns can be edited and re-sent.

The admin UI displays the new `FAILED` state with a red indicator and allows editing failed campaigns.
