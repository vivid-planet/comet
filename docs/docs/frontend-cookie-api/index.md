---
title: (draft) Working with cookies 🍪
sidebar_position: 16
---

-   [ ] TODO: Explain roughly what the goal of this cookie stuff is

## Configuration

-   [ ] TODO: Explain how to configure the projects cookie settings (`site/src/util/cookies.ts`)
    -   `cookieIds`
    -   `useCookieApi`

## The `<CookieSafe />` Component

-   [ ] TODO: Explain usage of the `<CookieSafe />` component

## Cookie APIs

-   [ ] TODO: Explain what the cookie api is and what it does

### Dev Cookie Api

-   [ ] TODO: Explain why this is needed/how it is used

#### Debugging using the dev tools console

Open Cookie Settings:

```js
window.cometDevCookieApi.openCookieSettings();
```

View the currently consented cookies:

```js
window.cometDevCookieApi.consentedCookies;
```
