---
"@comet/site-react": patch
---

Use `OnetrustActiveGroups` instead of `ConsentIntegrationData` in `useOneTrustCookieApi`

`ConsentIntegrationData` is used for OneTrust's internal logging and can be `null`, which caused `useOneTrustCookieApi` to crash. As recommended by OneTrust support, `window.OnetrustActiveGroups` is used instead, as it is always available when the consent banner is implemented.
