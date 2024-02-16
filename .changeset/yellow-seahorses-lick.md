---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/eslint-config": minor
"@comet/cms-site": minor
---

Revise Site-Preview and Block-Preview

The Site-Preview now uses the Next.JS Preview mode.
Both previews are entered by navigating to an API-Route in the site, which have to be executed in a secured environment.
In the API-Routes the current scope is checked (and possibly stored), then the client is redirected to the Preview.

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
    -   Add Next.JS API-Routes for Block-Preview and Site-Preview (eg. `/api/site-preview` `/api/block-preview`)
    -   Call `getValidatedSitePreviewParams()` in these API-Routes (calls the API which checks the Authorization-Header with the submitted scope)
    -   Use the `path`-part of the return value to redirect to the preview

Requires following changes to admin

-   The `SitesConfigProvider` needs the absolute Urls to the mentioned API-Routes
-   Use `previewPath` instead of `previewUrl` in Block-Previews in Admin
