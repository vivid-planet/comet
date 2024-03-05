---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/eslint-config": minor
"@comet/cms-site": minor
---

Migrate site preview to Next.js Preview Mode

Requires following changes to site:

-   Import `useRouter` from `next/router` (not exported from `@comet/cms-site` anymore)
-   Import `Link` from `next/link` (not exported from `@comet/cms-site` anymore)
-   Remove preview pages (pages in `src/pages/preview/` directory which call `createGetUniversalProps` with preview parameters)
-   Remove `createGetUniversalProps`
    -   Just implement `getStaticProps`/`getServerSideProps` (Preview Mode will SSR automatically)
    -   Get `previewData` from `context` and use it to configure the GraphQL Client
-   Add `SitePreviewProvider` to `App` (typically in `src/pages/_app.tsx`)
-   Add `/api/preview` Next API route (see demo)

Requires following changes to API:

-   Set `sitePreviewSecret` in `PageTreeModule`-options (make sure it's the same across multiple API-instances)
