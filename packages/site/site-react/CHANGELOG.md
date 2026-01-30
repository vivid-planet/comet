# @comet/site-react

## 8.13.0

### Patch Changes

- 9f5c4e6: Fix height of DamVideoBlock when fill prop is set

## 8.12.0

## 8.11.1

### Patch Changes

- 02d2ba8: Fix autoplay behavior of `YouTubeVideoBlock`

## 8.11.0

## 8.10.0

### Patch Changes

- 37ecc3b: Fix play/pause behavior for the `PlayPauseButton` in `DamVideoBlock`, `VimeoVideoBlock` and `YoutubeVideoBlock`

## 8.9.0

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

## 8.7.1

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

- a68d4c0: `fetchInMemoryCache` now caches persisted queries
- db4b750: Add functionality for persisted queries on client side
    - `createPersistedQueryGraphQLFetch`: GraphQLFetch implementation that calls the BFF Route Handler with an operation ID (hash)
    - `persistedQueryRoute`: BFF Route Handler that gets called by the above fetch and forwards the query to the API
    - `webpackPersistedQueriesLoader`: webpack loader that turns client-side queries into an operation ID (hash)

## 8.6.0

## 8.5.2

## 8.5.1

## 8.5.0

## 8.4.2

## 8.4.1

## 8.4.0

## 8.3.0

### Patch Changes

- c6ee74e: Remove unnecessary `rimraf` dependency
- 22ee3de: Add SEO `title` property to PixelImageBlock and SvgImageBlock

## 8.2.0

## 8.1.1

## 8.1.0

## 8.0.0

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

### Minor Changes

- 2a9f23d: Support block preview scope for BFF requests

    The current scope will be sent via a monkey patched fetch and interpreted in `previewParams()`.

### Patch Changes

- b8817b8: Add `AdminMessageType`, `IAdminContentScopeMessage`, `IAdminGraphQLApiUrlMessage`, `IAdminHoverComponentMessage`, `IAdminShowOnlyVisibleMessage`, `IFrameHoverComponentMessage`, `IFrameLocationMessage`, `IFrameMessage`, `IFrameMessageType`, `IFrameOpenLinkMessage`, `IFrameSelectComponentMessage`, and `IReadyIFrameMessage` to the public API
- b8817b8: Add `AdminMessageType`, `IAdminContentScopeMessage`, `IAdminGraphQLApiUrlMessage`, `IAdminHoverComponentMessage`, `IAdminShowOnlyVisibleMessage`, `IFrameHoverComponentMessage`, `IFrameLocationMessage`, `IFrameMessage`, `IFrameMessageType`, `IFrameOpenLinkMessage`, `IFrameSelectComponentMessage`, and `IReadyIFrameMessage` to the public API

## 8.0.0-beta.6

## 8.0.0-beta.5

## 7.25.3

### Patch Changes

- e300d66d2: Fix the aspect ratio of the preview skeleton of images when using `fill`

## 7.25.2

## 7.25.1

### Patch Changes

- db632346d: YouTube and Vimeo Video Block: fixed bug where the video does not start after clicking the play button in the preview image.

## 7.25.0

## 7.24.0

## 7.23.0

## 7.22.0

### Patch Changes

- e4327e250: Add missing `"use client"` directive to `useBlockPreviewFetch`

## 7.21.1

## 7.21.0

### Minor Changes

- ede41201a: Introduce new package `@comet/site-react`

    While `@comet/cms-site` and `@comet/site-nextjs` are Next.js specific, `@comet/site-react` is framework-agnostic and works in all React projects.
    `@comet/site-react` is pure ESM and uses SCSS modules instead of `styled-components`.

    To load the CSS, you need to import it like this in your project:

    ```ts
    import "@comet/site-react/css";
    ```

    Also make sure the css is not tree-shaken by your bundler.
