---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/eslint-config": minor
"@comet/cms-site": minor
---

Migrate Site-Preview to Next.js Preview Mode

Requires following changes to site:

-   Import useRouter from next/router (not exported from @comet/cms-site anymore)
-   Import Link from next/link (there is no export from @comet/cms-site anymore)
-   Remove Preview Pages (Pages under preview/ subdirectory which call createGetUniversalProps with preview parameters)
-   Remove createGetUniversalProps
    -   Just implement getStaticProps/getServerSideProps (Preview Mode will SSR automatically)
    -   Get previewData from context and use it to configure the GraphQL-Client
-   Add SitePreviewProvider to App when Preview Mode is active
-   Add /api/preview

Requires following changes to api:

-   Set sitePreviewSecret in PageTreeModule-options (make sure it's the same for the across multiple api-instances)
