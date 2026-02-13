# @comet/site-nextjs

## 8.14.0

### Patch Changes

- @comet/site-react@8.14.0

## 8.13.0

### Patch Changes

- Updated dependencies [9f5c4e6]
    - @comet/site-react@8.13.0

## 8.12.0

### Patch Changes

- @comet/site-react@8.12.0

## 8.11.1

### Patch Changes

- Updated dependencies [02d2ba8]
    - @comet/site-react@8.11.1

## 8.11.0

### Patch Changes

- @comet/site-react@8.11.0

## 8.10.0

### Patch Changes

- Updated dependencies [37ecc3b]
    - @comet/site-react@8.10.0

## 8.9.0

### Patch Changes

- @comet/site-react@8.9.0

## 8.8.0

### Minor Changes

- d538073: Add an overridable `PlayPauseButton` to all video blocks to enable pausing videos without controls and export its types `PlayPauseButtonProps`

    To add custom styling to the button, a custom component can be passed to the video blocks, for example:

    ```tsx
        const getSupportedBlocks = (sizes: string, aspectRatio: string, fill?: boolean): SupportedBlocks => {
        ...
        return {
            damVideo: (data) => (
                <DamVideoBlock
                    data={data}
                    previewImageSizes={sizes}
                    aspectRatio={aspectRatio}
                    fill={fill}
                    renderPlayPauseButton={(props) => <PlayPauseButton {...props} />}
                />
            ),
        };
    ```

    The custom button component needs to accept `PlayPauseButtonProps` to guarantee its functionality.

### Patch Changes

- Updated dependencies [d538073]
    - @comet/site-react@8.8.0

## 8.7.1

### Patch Changes

- @comet/site-react@8.7.1

## 8.7.0

### Minor Changes

- 27f15e3: Block Loader: infer `LoadedData` from loader return type

    Use the new `BlockLoaderOptions` type to allow inferring the type from the loader function.

    **Before**

    ```ts
    export const loader: BlockLoader<NewsLinkBlockData> = async ({ blockData, graphQLFetch }): Promise<LoadedData | null> => {
        // ...
    };

    export interface LoadedData {
        title: string;
    }
    ```

    **After**

    ```ts
    export const loader = async ({ blockData, graphQLFetch }: BlockLoaderOptions<NewsLinkBlockData>) => {
        // ...
    };

    export type LoadedData = Awaited<ReturnType<typeof loader>>;
    ```

- 10fc9e7: Move `YoutubeVideoBlock`, `VimeoVideoBlock` and `DamVideoBlock` to `@comet/site-react`

    The blocks in `@comet/site-react` provide no default implementation for `renderPreviewImage`.
    Instead, use the new `VideoPreviewImage` component with the `renderImage` prop to create the preview image.

- 559c536: Move `DamFileDownloadLinkBlock`, `EmailLinkBlock`, `ExternalLinkBlock` and `PhoneLinkBlock` to `@comet/site-react`

    The blocks have no dependency on Next.js and can therefore be in the generic React package.

- db4b750: Add functionality for persisted queries on client side
    - `createPersistedQueryGraphQLFetch`: GraphQLFetch implementation that calls the BFF Route Handler with an operation ID (hash)
    - `persistedQueryRoute`: BFF Route Handler that gets called by the above fetch and forwards the query to the API
    - `webpackPersistedQueriesLoader`: webpack loader that turns client-side queries into an operation ID (hash)

### Patch Changes

- Updated dependencies [27f15e3]
- Updated dependencies [10fc9e7]
- Updated dependencies [559c536]
- Updated dependencies [a68d4c0]
- Updated dependencies [db4b750]
    - @comet/site-react@8.7.0

## 8.6.0

### Patch Changes

- @comet/site-react@8.6.0

## 8.5.2

### Patch Changes

- a5500b1: Set `referrerPolicy="strict-origin-when-cross-origin"` in the `YouTubeVideoBlock`

    Apparently, YouTube recently started requiring a `Referer` header for embedded videos. If no `Referer` is present, the video fails to load ("Error 153").
    - @comet/site-react@8.5.2

## 8.5.1

### Patch Changes

- @comet/site-react@8.5.1

## 8.5.0

### Patch Changes

- @comet/site-react@8.5.0

## 8.4.2

### Patch Changes

- @comet/site-react@8.4.2

## 8.4.1

### Patch Changes

- @comet/site-react@8.4.1

## 8.4.0

### Patch Changes

- @comet/site-react@8.4.0

## 8.3.0

### Patch Changes

- c6ee74e: Remove unnecessary `rimraf` dependency
- 22ee3de: Add SEO `title` property to PixelImageBlock and SvgImageBlock
- Updated dependencies [c6ee74e]
- Updated dependencies [22ee3de]
    - @comet/site-react@8.3.0

## 8.2.0

### Minor Changes

- 8ba4f62: Prevent phishing in SitePreview

    Affected applications: if the property `resolvePath` of the `SitePreview` component returns the plain path. The default implementation in the starter is not affected.

- f1890f0: Improve accessibility of `playIcon` by setting an aria-label that can be overridden by using the `playButtonAriaLabel` prop in `DamVideoBlock`, `YoutubeBlock` and `VimeoBlock`

### Patch Changes

- @comet/site-react@8.2.0

## 8.1.1

### Patch Changes

- @comet/site-react@8.1.1

## 8.1.0

### Patch Changes

- @comet/site-react@8.1.0

## 8.0.0

### Major Changes

- 67ae9df: Fix opacity on `VideoPreviewImage` to only affect the background color
- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

- eb65ef1: Remove unused GraphQL client/fetch from site preview handlers

    The client/fetch was passed as the last argument for `sitePreviewRoute` and `legacyPagesRouterSitePreviewApiHandler`.
    Remove the argument from the respective function calls or use the provided upgrade script (https://github.com/vivid-planet/comet-upgrade/pull/33)

- 23f393b: Protect images in the site preview

    The image URLs in the site preview are now generated as preview URLs.
    Authorization is handled via the new `createSitePreviewAuthService`, which validates the site preview cookie.

- e19e997: Remove the `@comet/cms-site` package in favor of `@comet/site-nextjs`

### Minor Changes

- e3e1bdc: Add createFetchWithDefaultNextRevalidate that applies next.revalidate only if cache is not set
- 2a9f23d: Support block preview scope for BFF requests

    The current scope will be sent via a monkey patched fetch and interpreted in `previewParams()`.

### Patch Changes

- b8817b8: Add `AdminMessageType`, `IAdminContentScopeMessage`, `IAdminGraphQLApiUrlMessage`, `IAdminHoverComponentMessage`, `IAdminShowOnlyVisibleMessage`, `IFrameHoverComponentMessage`, `IFrameLocationMessage`, `IFrameMessage`, `IFrameMessageType`, `IFrameOpenLinkMessage`, `IFrameSelectComponentMessage`, and `IReadyIFrameMessage` to the public API
- bc00273: Set focus on `playIcon` in VideoPreviewImage for better visibility
- b5d084a: Include `@comet/site-react` in the bundle of `@comet/site-nextjs`

    Previously, `@comet/site-react` was treated as an external dependency.

    In `@comet/site-nextjs`' index.ts, many exports from `@comet/site-react` are reexported.
    This caused problems in NextJS when using methods from `@comet/site-react` in the middleware.
    Edge runtime errors containing completely unrelated modules occurred, e.g.

    > The error was caused by importing 'usehooks-ts/dist/index.js' in '../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js'.
    >
    > Import trace for requested module:
    > ../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js
    > ../../packages/site/site-react/lib/index.js
    > ../../packages/site/site-nextjs/lib/index.js
    > ./src/middleware/predefinedPages.ts
    > ./src/middleware.ts
    > occurred in a file that only imported

    ```ts
    import { createFetchWithDefaults, createGraphQLFetch } from "@comet/site-nextjs";
    ```

    This is due to a Webpack behavior that pulls all exports in the reexport statement into the middleware bundle.

    Bundling `@comet/site-react` with `@comet/site-nextjs` prevents this behavior and the associated error.

- b8817b8: Add `AdminMessageType`, `IAdminContentScopeMessage`, `IAdminGraphQLApiUrlMessage`, `IAdminHoverComponentMessage`, `IAdminShowOnlyVisibleMessage`, `IFrameHoverComponentMessage`, `IFrameLocationMessage`, `IFrameMessage`, `IFrameMessageType`, `IFrameOpenLinkMessage`, `IFrameSelectComponentMessage`, and `IReadyIFrameMessage` to the public API
- Updated dependencies [f904b71]
- Updated dependencies [b8817b8]
- Updated dependencies [b8817b8]
- Updated dependencies [2a9f23d]
    - @comet/site-react@8.0.0

## 8.0.0-beta.6

### Major Changes

- e19e997: Remove the `@comet/cms-site` package in favor of `@comet/site-nextjs`

### Patch Changes

- @comet/site-react@8.0.0-beta.6

## 8.0.0-beta.5

### Patch Changes

- @comet/site-react@8.0.0-beta.5

## 7.25.3

### Patch Changes

- b1701abf4: Include `@comet/site-react` in the bundle of `@comet/site-nextjs`

    Previously, `@comet/site-react` was treated as an external dependency.

    In `@comet/site-nextjs`' index.ts, many exports from `@comet/site-react` are reexported.
    This caused problems in NextJS when using methods from `@comet/site-react` in the middleware.
    Edge runtime errors containing completely unrelated modules occurred, e.g.

    > The error was caused by importing 'usehooks-ts/dist/index.js' in '../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js'.
    >
    > Import trace for requested module:
    > ../../packages/site/site-react/lib/cookies/useLocalStorageCookieApi.js
    > ../../packages/site/site-react/lib/index.js
    > ../../packages/site/site-nextjs/lib/index.js
    > ./src/middleware/predefinedPages.ts
    > ./src/middleware.ts
    > occurred in a file that only imported

    ```ts
    import { createFetchWithDefaults, createGraphQLFetch } from "@comet/site-nextjs";
    ```

    This is due to a Webpack behavior that pulls all exports in the reexport statement into the middleware bundle.

    Bundling `@comet/site-react` with `@comet/site-nextjs` prevents this behavior and the associated error.

- Updated dependencies [e300d66d2]
    - @comet/site-react@7.25.3

## 7.25.2

### Patch Changes

- @comet/site-react@7.25.2

## 7.25.1

### Patch Changes

- db632346d: YouTube and Vimeo Video Block: fixed bug where the video does not start after clicking the play button in the preview image.
- Updated dependencies [db632346d]
    - @comet/site-react@7.25.1

## 7.25.0

### Minor Changes

- b421ed273: Support captions in the `DamVideoBlock`

    The captions can be set uploaded as .vtt files and linked to videos in the DAM.

### Patch Changes

- @comet/site-react@7.25.0

## 7.24.0

### Patch Changes

- @comet/site-react@7.24.0

## 7.23.0

### Patch Changes

- @comet/site-react@7.23.0

## 7.22.0

### Patch Changes

- Updated dependencies [e4327e250]
    - @comet/site-react@7.22.0

## 7.21.1

### Patch Changes

- c84874edf: Revert "Fix `PixelImageBlock` fixed height, auto width issue" added in v7.20.0

    In v7.20.0, height was set to `100%` for `PixelImageBlock`.
    This caused issues when the image was not wrapped, as it would inherit the height of the next parent element instead of maintaining its aspect ratio.
    Thus, we are reverting this change to restore the previous behavior.
    - @comet/site-react@7.21.1

## 7.21.0

### Minor Changes

- 904ff5f1d: Introduce new package `@comet/site-nextjs` as copy of `@comet/cms-site`

    Changes:
    - Remove `styled-components` as peer dependency
    - use SCSS modules instead
    - `@comet/site-nextjs` is pure ESM

    To load the CSS, you need to import it like this:

    ```ts
    import "@comet/site-nextjs/css";
    ```

    In Next.js you can do that in `/app/layout.tsx`.

### Patch Changes

- Updated dependencies [ede41201a]
    - @comet/site-react@7.21.0
