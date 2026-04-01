---
"@comet/site-react": patch
---

Fall back to `OnetrustActiveGroups` when `ConsentIntegrationData` is `null`

`ConsentIntegrationData` can be `null` because it is used for OneTrust's internal logging. This caused `useOneTrustCookieApi` to crash when the data wasn't available. As recommended by OneTrust support, `window.OnetrustActiveGroups` is now used as a fallback, as it is always written when the consent banner is implemented.
