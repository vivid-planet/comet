## Why

Comet CMS exposes pixel-image content via `PixelImageBlockData` (DAM file + URL template + crop area). Rendering these images in emails requires picking a DPR-aware width from the API's allowed image sizes, generating an absolute URL from the URL template, and passing the result to either `<img>` (raw HTML) or `<mj-image>` (MJML). Today consumers re-implement this logic per project. First-class block components remove that duplication and produce correctly-sized, responsive images by default.

## What Changes

- Add `HtmlPixelImageBlock` — renders a pixel-image as an `<img>` tag for raw HTML / MJML ending-tag context
- Add `MjmlPixelImageBlock` — renders a pixel-image via the re-exported `MjmlImage` for MJML context
- Add an internal `usePixelImageData` hook that resolves the optimal width and image URL from `PixelImageBlockData`
- Read `validSizes` and `baseUrl` from the consumer-provided `Config` context (introduced in `add-config-context`); throw a clear error when `config.pixelImage` is not set
- Declare `pixelImage?: { validSizes: number[]; baseUrl: string }` as a known optional key on the `Config` interface
- Add an optional `aspectRatio?: number | string` prop on both blocks. When set, it overrides the DAM-crop-derived aspect ratio for both the URL `$resizeHeight` substitution and the rendered `height` attribute. Strings accept `"WxH"`, `"W:H"`, or `"W/H"` (e.g., `"16x9"`, `"16:9"`, `"16/9"`); numbers are interpreted as `width / height` directly.
- Always render the underlying element with a stable class name (`htmlPixelImageBlock` for the `<img>` rendered by `HtmlPixelImageBlock`, `mjmlPixelImageBlock` on the `MjmlImage`). Caller-supplied `className` is merged with the stable class via `clsx`, mirroring the pattern established by `HtmlInlineLink`.
- Below the default breakpoint, scale rendered pixel-images to their container width via `registerStyles`. `MjmlPixelImageBlock` overrides the inline `height` MJML emits on the `<img>` with `height: auto !important`; `HtmlPixelImageBlock` overrides the HTML `width`/`height` presentation attributes with `width: 100%; height: auto;`. Both rules are scoped under `theme.breakpoints.default.belowMediaQuery`.
- Export both block components and their prop types from `src/index.ts`
- Add Storybook stories for both blocks
- Add a changeset describing the new exports

## Capabilities

### New Capabilities
- `pixel-image-blocks`: HTML and MJML block components for rendering `PixelImageBlockData` in email templates, including width/URL resolution against the runtime `Config`.

### Modified Capabilities
<!-- None. The `pixelImage` key is added to `Config` via TypeScript interface declaration merging inside this package; that augmentation is an implementation detail of `pixel-image-blocks`, not a behavioral change to the `config-context` capability itself. -->

## Impact

- **Depends on** the `add-config-context` change (which introduces the `Config` interface, `ConfigProvider`, `useConfig`, and the `config` prop on `MjmlMailRoot`). This change must be merged first.
- New files under `packages/mail-react/src/blocks/pixelImage/`:
    - `HtmlPixelImageBlock.tsx`
    - `MjmlPixelImageBlock.tsx`
    - `usePixelImageData.ts`
    - `usePixelImageConfig.ts`
    - `__stories__/HtmlPixelImageBlock.stories.tsx`
    - `__stories__/MjmlPixelImageBlock.stories.tsx`
    - `__stories__/exampleBlockData.ts`
- New exports in `src/index.ts`: `HtmlPixelImageBlock`, `HtmlPixelImageBlockProps`, `MjmlPixelImageBlock`, `MjmlPixelImageBlockProps`, `PixelImageConfig`
- Augments the `Config` interface with the optional `pixelImage` key (additive, non-breaking)
- New changeset under `.changeset/` at the repo root
