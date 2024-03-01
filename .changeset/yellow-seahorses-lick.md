---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/eslint-config": minor
"@comet/cms-site": minor
---

Revise site preview and block preview

The site preview review now uses the Next.JS Preview mode.
The preview is entered by navigating to an API-Route in the site, which has to be executed in a secured environment.
In the API-Routes the current scope is checked (and possibly stored), then the client is redirected to the Preview.
The block preview now uses a single base url and stores the content scope in the a React context instead requiring a
url for every content scope.

// TODO Move the following introduction to the migration guide before releasing

Requires following changes to site:

-   Import `useRouter` from `next/router` (not exported from `@comet/cms-site` anymore)
-   Import `Link` from `next/link` (not exported from `@comet/cms-site` anymore)
-   Remove preview pages (pages in `src/pages/preview/` directory which call `createGetUniversalProps` with preview parameters)
-   Remove `createGetUniversalProps`
    -   Just implement `getStaticProps`/`getServerSideProps` (Preview Mode will SSR automatically)
    -   Get `previewData` from `context` and use it to configure the GraphQL Client
-   Add `SitePreviewProvider` to `App` (typically in `src/pages/_app.tsx`)
-   Provide a protected environment for the site
    -   Make sure that a Authorization-Header is present in this environment
    -   Add a Next.JS API-Route for the site preview (eg. `/api/site-preview`)
    -   Call `getValidatedSitePreviewParams()` in the API-Route (calls the API which checks the Authorization-Header with the submitted scope)
    -   Use the `path`-part of the return value to redirect to the preview

Requires following changes to admin

-   The `SitesConfigProvider` needs the absolute urls to the site preview API-Route
-   The `SitesConfigProvider` needs the absolute base Url to the block preview
-   Use `previewPath` instead of `previewUrl` in block previews in Admin
