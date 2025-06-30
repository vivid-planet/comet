# @comet/site-nextjs

## 7.25.0

### Minor Changes

-   b421ed273: Support captions in the `DamVideoBlock`

    The captions can be set uploaded as .vtt files and linked to videos in the DAM.

### Patch Changes

-   @comet/site-react@7.25.0

## 7.24.0

### Patch Changes

-   @comet/site-react@7.24.0

## 7.23.0

### Patch Changes

-   @comet/site-react@7.23.0

## 7.22.0

### Patch Changes

-   Updated dependencies [e4327e250]
    -   @comet/site-react@7.22.0

## 7.21.1

### Patch Changes

-   c84874edf: Revert "Fix `PixelImageBlock` fixed height, auto width issue" added in v7.20.0

    In v7.20.0, height was set to `100%` for `PixelImageBlock`.
    This caused issues when the image was not wrapped, as it would inherit the height of the next parent element instead of maintaining its aspect ratio.
    Thus, we are reverting this change to restore the previous behavior.

    -   @comet/site-react@7.21.1

## 7.21.0

### Minor Changes

-   904ff5f1d: Introduce new package `@comet/site-nextjs` as copy of `@comet/cms-site`

    Changes:

    -   Remove `styled-components` as peer dependency
    -   use SCSS modules instead
    -   `@comet/site-nextjs` is pure ESM

    To load the CSS, you need to import it like this:

    ```ts
    import "@comet/site-nextjs/css";
    ```

    In Next.js you can do that in `/app/layout.tsx`.

### Patch Changes

-   Updated dependencies [ede41201a]
    -   @comet/site-react@7.21.0
