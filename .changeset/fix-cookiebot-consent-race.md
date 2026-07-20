---
"@comet/site-react": patch
"@comet/site-nextjs": patch
---

Fix client-side crash in `useCookieBotCookieApi` when Cookiebot is not yet initialized

The hook read `window.Cookiebot.consent` in its initial call, but `window.Cookiebot` exists as soon as the Cookiebot script has run, while `consent` is only populated once Cookiebot fires `CookiebotOnConsentReady`. Calling `Object.keys(consent)` before that threw `TypeError: Cannot convert undefined or null to object`, crashing the client. The initial call is now a no-op until consent is available.
