# @comet/site-nextjs

## 8.0.0-beta.7

### Minor Changes

- 2a9f23d: Support block preview scope for BFF requests

    The current scope will be sent via a monkey patched fetch and interpreted in `previewParams()`.

### Patch Changes

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

- Updated dependencies [2a9f23d]
    - @comet/site-react@8.0.0-beta.7

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
