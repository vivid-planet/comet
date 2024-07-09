# @comet/cms-site

## 7.0.0-beta.3

## 7.0.0-beta.2

## 7.0.0-beta.1

## 7.0.0-beta.0

### Major Changes

-   4f32ad014: Bump styled-components peer dependency to v6

    Follow the official [migration guide](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6) to upgrade.

-   9351b1452: Upgrade to Next 14 and React 18

    Add "use client" directive to components that currently require it (as they use styled-components or a context)

-   86358bf87: Fix an issue where the block preview could break a block's styling and HTML structure

    This was caused by a `div` added around every block to enable the selection and highlighting of the block in the block preview.
    The `div` is still present but now uses `display: contents`, so its effect should be minimal.

    Common issues that should now be resolved include:

    -   The image inside, e.g., a `PixelImageBlock`, would not be visible because the image's size depends on the parent `div`'s size.
    -   Blocks used as children of elements with `display: flex` or `display: grid` could not position themselves correctly.

-   6986cdc82: Require `aspectRatio` prop for `PixelImageBlock` and `Image`

    The `16x9` default aspect ratio has repeatedly led to incorrectly displayed images on the site.
    Therefore, it has been removed.
    Instead, consider which aspect ratio to use for each image.

    **Example**

    ```diff
    <PixelImageBlock
      data={teaser}
      layout="fill"
    + aspectRatio="16x9"
    />
    ```

-   ae0142029: Support single host for block preview

    The content scope is passed through the iframe-bridge in the admin and accessible in the site in the IFrameBridgeProvider.
    Breaking: `previewUrl`-property of `SiteConfig` has changed to `blockPreviewBaseUrl`

### Minor Changes

-   36cdd70f1: Deprecate `InternalLinkBlock` component, instead there should be a copy of this component in the application for flexibility (e.g., support for internationalized routing)
-   6d56606a8: Store site preview scope in cookie and add `previewParams()` helper to access it

    -   Requires the new `SITE_PREVIEW_SECRET` environment variable that must contain a random secret (not required for local development)
    -   Requires a Route Handler located at `app/api/site-preview/route.ts`:
    -   The previewParams() return a promise

        ```ts
        import { sitePreviewRoute } from "@comet/cms-site";
        import { createGraphQLFetch } from "@src/util/graphQLClient";
        import { type NextRequest } from "next/server";

        export const dynamic = "force-dynamic";

        export async function GET(request: NextRequest) {
            return sitePreviewRoute(request, createGraphQLFetch());
        }
        ```

-   a80ab10f3: Add GraphQL fetch client

    -   `createGraphQLFetch`: simple graphql client around fetch, usage: createGraphQLFetch(fetch, url)(gql, variables)
    -   `type GraphQLFetch = <T, V>(query: string, variables?: V, init?: RequestInit) => Promise<T>`
    -   `gql` for tagging queries
    -   `createFetchWithDefaults` fetch decorator that adds default values (eg. headers or next.revalidate)
    -   `createFetchWithPreviewHeaders` fetch decorator that adds comet preview headers (based on SitePreviewData)

    Example helper in application:

    ```
    export const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
    export function createGraphQLFetch(previewData?: SitePreviewData) {
        return createGraphQLFetchLibrary(
            createFetchWithDefaults(createFetchWithPreviewHeaders(fetch, previewData), { next: { revalidate: 15 * 60 } }),
            graphQLApiUrl,
        );

    }
    ```

    Usage example:

    ```
    const graphqlFetch = createGraphQLFetch(previewData);
    const data = await graphqlFetch<GQLExampleQuery, GQLExampleQueryVariables>(
        exampleQuery,
        {
            exampleVariable: "foo"
        }
    );
    ```

-   fc27014bc: Add new technique for blocks to load additional data at page level when using SSR

    This works both server-side (SSR, SSG) and client-side (block preview).

    New Apis:

    -   `recursivelyLoadBlockData`: used to call loaders for a block data tree
    -   `BlockLoader`: type of a loader function that is responsible for one block
    -   `useBlockPreviewFetch`: helper hook for block preview that creates client-side caching graphQLFetch/fetch
    -   `BlockLoaderDependencies`: interface with dependencies that get passed through recursivelyLoadBlockData into loader functions. Can be extended using module augmentation in application to inject eg. pageTreeNodeId.

-   769bd72f0: Uses the Next.JS Preview mode for the site preview

    The preview is entered by navigating to an API-Route in the site, which has to be executed in a secured environment.
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
        -   Add a Next.JS API-Route for the site preview (eg. `/api/site-preview`)
        -   Call `getValidatedSitePreviewParams()` in the API-Route (calls the API which checks the Authorization-Header with the submitted scope)
        -   Use the `path`-part of the return value to redirect to the preview

    Requires following changes to admin

    -   The `SitesConfig` must provide a `sitePreviewApiUrl`

## 6.14.1

### Patch Changes

-   84a25adeb: Remove `<a>` tag from `DamFileDownloadLinkBlock`

    The block incorrectly added the tag which prevents styling it in the application. The tag has been removed to achieve the same behavior as in the other link blocks, e.g. `ExternalLinkBlock`.

## 6.14.0

### Minor Changes

-   73dfb61c9: Add `PhoneLinkBlock` and `EmailLinkBlock`

## 6.13.0

### Minor Changes

-   493cad7e1: Add `DamVideoBlock`

## 6.12.0

### Minor Changes

-   3ee8c7a33: Add a `DamFileDownloadLinkBlock` that can be used to download a file or open it in a new tab

    Also, add new `/dam/files/download/:hash/:fileId/:filename` endpoint for downloading assets.

## 6.11.0

## 6.10.0

### Minor Changes

-   5c1ab80d6: SeoBlock: Change Open Graph image to recommended size and aspect ratio (`1200x630`)

## 6.9.0

## 6.8.0

## 6.7.0

## 6.6.2

## 6.6.1

## 6.6.0

## 6.5.0

### Minor Changes

-   2f64daa9b: Add `title` field to link block

    Perform the following steps to use it in an application:

    1. API: Use the new `createLinkBlock` factory to create the LinkBlock:

        ```ts
        import { createLinkBlock } from "@comet/cms-api";

        // ...

        const LinkBlock = createLinkBlock({
            supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
        });
        ```

    2. Site: Pass the `title` prop to LinkBlock's child blocks:

    ```diff
    const supportedBlocks: SupportedBlocks = {
    -   internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
    +   internal: ({ children, title, ...props }) => <InternalLinkBlock data={props} title={title}>{children}</InternalLinkBlock>,
        // ...
    };
    ```

## 6.4.0

## 6.3.0

## 6.2.1

## 6.2.0

### Minor Changes

-   34bb33fe: Add `SeoBlock`

    Can be used as a drop-in replacement for `SeoBlock` defined in application code. Add a `resolveOpenGraphImageUrlTemplate` to resolve the correct image URL template when using a custom Open Graph image block.

    **Example Default Use Case:**

    ```tsx
    <SeoBlock data={exampleData} title={"Some Example Title"} />
    ```

    **Example Custom Use Case:**

    ```tsx
    <SeoBlock<SomeCustomImageBlockType>
        data={exampleData}
        title={"Some Example Title"}
        resolveOpenGraphImageUrlTemplate={(block) => block.some.path.to.urlTemplate}
    />
    ```

## 6.1.0

## 6.0.0

## 5.6.0

## 5.5.0

## 5.4.0

### Minor Changes

-   f9063860: Add `hasRichTextBlockContent` helper

    The helper can be used to conditionally render a `RichTextBlock`.

    **Example:**

    ```tsx
    import { hasRichTextBlockContent } from "@comet/cms-site";

    function TeaserBlock({ data: { image, text } }: PropsWithData<TeaserBlockData>) {
        return (
            <>
                <DamImageBlock data={image} />
                {hasRichTextBlockContent(text) && <RichTextBlock data={text} />}
            </>
        );
    }
    ```

## 5.3.0

## 5.2.0

### Minor Changes

-   6244d6cd: Add the `YouTubeVideoBlock` to the `@comet/cms-site` package.

## 5.1.0

## 5.0.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

### Patch Changes

-   51466b1a: Fix router.push() and router.replace() in site preview
