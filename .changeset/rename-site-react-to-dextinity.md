---
"@dextinity/site-react": major
---

Rename `@comet/site-react` to `@dextinity/site-react`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the `cometType` property of iframe messages to `dextinityType`. A matching `@dextinity/cms-admin` version is required
- Rename the window property of `useLocalStorageCookieApi` from `window.cometLocalStorageCookieApi` to `window.dextinityLocalStorageCookieApi` and its localStorage key from `comet-dev-cookie-api-consented-cookies` to `dextinity-dev-cookie-api-consented-cookies`. Previously consented cookies are therefore reset in local development
