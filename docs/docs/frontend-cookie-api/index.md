---
title: Working with cookies 🍪
sidebar_position: 16
---

Third-party cookies might be set when embedding external content, e.g., YouTube Videos or Google Maps.
To comply with GDPR, the user must consent to these cookies before the content is loaded.

By configuring the cookie API and using the `<CookieSafe />` component, we can ensure that content is only loaded once the user has consented to the required cookies.

## Cookie APIs

The `useCookieApi` hook provides access to the list of consented cookies and a function that can be called to open the cookie settings.

```ts
import { useCookieApi } from "@src/util/cookies";

const { consentedCookies, openCookieSettings } = useCookieApi();
```

### Existing hooks for cookie providers

Hooks for some cookie providers are already implemented:

-   `useOneTrustCookieApi` for [OneTrust](https://www.onetrust.com/)
-   `useCookieBotCookieApi` for [CookieBot](https://www.cookiebot.com/)
-   `useLocalStorageCookieApi` for local development and other environments that cannot embed the real cookie provider

For other cookie providers, a custom hook can be created. It must have the type of `CookieApi`.

### LocalStorage Cookie Api

For local development and other environments that do not embed the project's cookie provider, the `useLocalStorageCookieApi` hook can be used.

#### Debugging using the dev tools console

The localStorage cookie api can be accessed via the dev tools console with `window.cometLocalStorageCookieApi`.

##### Open Cookie Settings

```js
window.cometLocalStorageCookieApi.openCookieSettings();
```

##### View the currently consented cookies

```js
window.cometLocalStorageCookieApi.consentedCookies;
```

## Using the `<CookieSafe />` component

The `<CookieSafe />` component should wrap content that might load third-party cookies.
If the required cookies have not been consented to, a fallback component is rendered instead of the children.

```tsx
import { cookieIds, useCookieApi } from "@src/util/cookies";
import { CookieSafe } from "@comet/cms-site";

export const CookieSafeExternalContent = () => {
    const { consentedCookies } = useCookieApi();

    return (
        <CookieSafe
            consented={consentedCookies.includes(cookieIds.thirdParty)}
            fallback={<CookieFallback />}
        >
            <ComponentThatLoadsExternalContent />
        </CookieSafe>
    );
};
```

### Fallback component

The fallback component should display a message to the user and allow them to open the cookie settings.

```tsx
import { useCookieApi } from "@src/util/cookies";

export const CookieFallback = () => {
    const { openCookieSettings } = useCookieApi();
    return (
        <>
            <p>Cookies need to be accepted to view this content.</p>
            <button onClick={() => openCookieSettings()}>Open Cookie Settings</button>
        </>
    );
};
```

## Configuration

**Create a file to contain the cookie configuration, e.g., `site/src/util/cookies.ts`:**

The file should export `useCookieApi`, the correct cookie API hook for the current environment.

For example, the `useLocalStorageCookieApi` hook is used for development, and the `useOneTrustCookieApi` hook is used for production.

```ts
import {
    useLocalStorageCookieApi,
    useOneTrustCookieApi as useProductionCookieApi,
} from "@comet/cms-site";

export const useCookieApi =
    process.env.NODE_ENV === "development" ? useLocalStorageCookieApi : useProductionCookieApi;
```

Additionally, the file should export an object that provides the IDs of the cookies defined by the cookie provider.

```ts
export const cookieIds = {
    thirdParty: "THIRD_PARTY",
    analytics: "ANALYTICS",
};
```
