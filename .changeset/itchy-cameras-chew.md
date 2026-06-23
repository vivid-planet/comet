---
"@comet/site-react": patch
---

Fix Cookiebot consent initialization

Fix a race condition where the `CookiebotOnConsentReady` event fires before the `useCookieBotCookieApi` hook is mounted.
