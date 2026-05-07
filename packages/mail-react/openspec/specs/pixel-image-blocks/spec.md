# pixel-image-blocks Specification

## Purpose

HTML and MJML block components for rendering Comet CMS `PixelImageBlockData` in email templates, so consumers don't re-implement pixel-image width selection, URL resolution, and responsive scaling per project. The blocks pick a DPR-aware render width from `config.pixelImage.validSizes`, resolve an absolute image URL from `data.urlTemplate` (prefixing `config.pixelImage.baseUrl` when relative), derive the aspect ratio from the DAM crop area (with an optional explicit override), and scale to container width below the default breakpoint. `HtmlPixelImageBlock` renders an `<img>` for raw HTML or MJML ending-tag context; `MjmlPixelImageBlock` renders the re-exported `MjmlImage` for MJML context.

## Requirements

### Requirement: Pixel-image block components

The package SHALL export two components for rendering `PixelImageBlockData` from Comet CMS:

- `HtmlPixelImageBlock` — renders an `<img>` tag for use in raw HTML context (HTML-only emails or inside MJML ending tags such as `MjmlRaw`).
- `MjmlPixelImageBlock` — renders the re-exported `MjmlImage` for use in MJML context. Must be placed within an `MjmlColumn`.

Both components accept the block data, a required render width, an optional largest-possible-render-width override, and pass-through props forwarded to the underlying element (`<img>` props for `HtmlPixelImageBlock`, `MjmlImageProps` for `MjmlPixelImageBlock`).

The components SHALL set `alt` and `title` on the rendered element from the corresponding fields on `data.damFile`.

#### Scenario: Pass-through props override defaults

- **WHEN** a caller passes a prop that has a default sourced from the block data (e.g. `alt`, `title`)
- **THEN** the caller-supplied value wins, allowing per-render-site overrides while preserving DAM defaults when omitted

### Requirement: Block components require `pixelImage` configuration

`HtmlPixelImageBlock` and `MjmlPixelImageBlock` SHALL read `validSizes` and `baseUrl` from `config.pixelImage` via the `useConfig` hook. When `config.pixelImage` is not set, the block SHALL throw an error that names the missing configuration and points at where to provide it (`MjmlMailRoot.config` or `ConfigProvider`).

#### Scenario: No config provided

- **WHEN** a `MjmlPixelImageBlock` or `HtmlPixelImageBlock` is rendered in a tree where `config.pixelImage` is not set
- **THEN** the block throws an error explaining which configuration key is missing and how to provide it

### Requirement: `Config` declares the `pixelImage` key

The `Config` interface exported from the package SHALL include an optional `pixelImage` member of type `{ validSizes: number[]; baseUrl: string }`. Both fields are required when `pixelImage` is provided.

#### Scenario: Partial pixelImage configuration

- **WHEN** a consumer provides `config.pixelImage` with only one of `validSizes` or `baseUrl`
- **THEN** TypeScript reports an error at the call site (the inner object's fields are not individually optional)

### Requirement: Render width selection

The block components SHALL resolve the rendered image source URL using a render width chosen from `config.pixelImage.validSizes`:

- The component's `width` prop is the default render width (the width at which the image displays in the default/desktop breakpoint).
- The optional `largestPossibleRenderWidth` prop names the largest width the image can ever display at across breakpoints; when omitted, it defaults to `theme.sizes.bodyWidth`.
- If `width` equals `largestPossibleRenderWidth`, pick `largestPossibleRenderWidth × 2` (a fixed-size DPR-2 image).
- Otherwise, pick the smallest entry in `validSizes` greater than or equal to `width × 2`.
- If no entry qualifies, pick the largest entry in `validSizes`.

#### Scenario: No valid size large enough for DPR-2

- **WHEN** every entry in `validSizes` is smaller than `width × 2`
- **THEN** the block uses the largest available `validSizes` entry rather than throwing

### Requirement: Image URL resolution

The block components SHALL build the rendered image URL by replacing `$resizeWidth` and `$resizeHeight` placeholders in `data.urlTemplate` with the chosen render width and a height computed from the resolved aspect ratio (`Math.ceil(width / aspectRatio)`). When the resulting URL is not absolute (does not start with a scheme), the block SHALL prefix it with `config.pixelImage.baseUrl`.

#### Scenario: Absolute URL template

- **WHEN** `data.urlTemplate` is already an absolute URL (starts with a scheme such as `https:`)
- **THEN** the resolved image URL is used as-is and `config.pixelImage.baseUrl` is not prefixed

### Requirement: Aspect ratio resolution

The block components SHALL determine the rendered aspect ratio from the DAM crop area (using `data.cropArea` when set, otherwise `data.damFile.image.cropArea`):

- For `focalPoint: "SMART"`, use the natural aspect ratio of `data.damFile.image` (`width / height`).
- For any other focal point, derive the aspect ratio from the crop dimensions: `(cropArea.width × image.width) / (cropArea.height × image.height)`. The block SHALL throw when crop dimensions are missing for a non-`SMART` focal point.

#### Scenario: Non-SMART crop missing dimensions

- **WHEN** `cropArea.focalPoint` is not `"SMART"` and `cropArea.width` or `cropArea.height` is undefined
- **THEN** the block throws an error explaining that crop dimensions are missing — this is a malformed DAM record, not a runtime branch the block silently handles

### Requirement: Render nothing when image data is incomplete

When `data.damFile?.image` is absent, both block components SHALL render nothing (no element output). They SHALL NOT throw in this case — incomplete or unset CMS data is an expected state.

#### Scenario: Missing damFile

- **WHEN** `data.damFile` is `undefined` (the CMS record exists but no DAM file is attached)
- **THEN** the block renders nothing (no `<img>` / `MjmlImage` is emitted) and does not throw

### Requirement: Explicit aspect-ratio override

The block components SHALL accept an optional `aspectRatio` prop of type `number | string`. When set, this value SHALL be used both for the `$resizeHeight` placeholder substitution in the resolved image URL and for the `height` attribute on the rendered element, replacing the aspect ratio that would otherwise be derived from `data.cropArea` or `data.damFile.image.cropArea`.

Accepted value formats:

- `number` — interpreted as `width / height` directly (e.g., `1.7778` for 16:9).
- `string` — parsed by splitting on `x`, `:`, or `/`. Examples: `"16x9"`, `"16:9"`, `"16/9"`. A single numeric token (e.g., `"2"`) is interpreted as `width / 1`.

When `aspectRatio` is omitted or `undefined`, the block SHALL fall back to the DAM-cropArea-derived aspect ratio described by the "Aspect ratio resolution" requirement.

#### Scenario: Number override

- **WHEN** a caller passes `aspectRatio={16/9}` to a pixel-image block
- **THEN** the resolved URL substitutes `$resizeHeight` using `Math.ceil(chosenWidth / (16 / 9))` and the rendered element's `height` attribute is computed from the same ratio
- **AND** any `data.cropArea` ratio is ignored for the rendered output

#### Scenario: String override with separator

- **WHEN** a caller passes `aspectRatio="16x9"`, `aspectRatio="16:9"`, or `aspectRatio="16/9"`
- **THEN** the prop is parsed as `16 / 9` and applied identically to the URL `$resizeHeight` and the element's `height`

#### Scenario: Malformed aspectRatio string

- **WHEN** the `aspectRatio` string cannot be parsed into one or two positive numbers
- **THEN** the block throws an error naming the offending value

### Requirement: Stable class name on rendered element

`HtmlPixelImageBlock` SHALL always include `htmlPixelImageBlock` in the `class` attribute of the rendered `<img>` element. `MjmlPixelImageBlock` SHALL always include `mjmlPixelImageBlock` in the class attribute of the rendered `MjmlImage` element. Caller-supplied `className` SHALL be merged with the stable class so both appear on the rendered element.

#### Scenario: Caller class merged with stable class

- **WHEN** a caller passes `className="hero-image"` to either block
- **THEN** the rendered element's class attribute contains both the stable class (`htmlPixelImageBlock` or `mjmlPixelImageBlock`) and `hero-image`

#### Scenario: No caller class

- **WHEN** the caller does not pass a `className`
- **THEN** the rendered element still has the stable class as its only class

### Requirement: Responsive scaling below the default breakpoint

The package SHALL register CSS rules — via `registerStyles` and `theme.breakpoints.default.belowMediaQuery` — that scale rendered pixel-images to their container width on viewports narrower than the default (body-width) breakpoint:

- `MjmlPixelImageBlock` rendered output SHALL apply `height: auto !important` to the inner `<img>` so the image keeps its aspect ratio when MJML scales width but emits a fixed inline `height: <px>` style.
- `HtmlPixelImageBlock` rendered output SHALL apply `width: 100%; height: auto;` to the `<img>` so the image scales down with its container instead of holding the desktop pixel width.

#### Scenario: Below the default breakpoint, MJML pixel-image preserves aspect ratio

- **WHEN** an email containing `MjmlPixelImageBlock` is rendered at a viewport narrower than `theme.breakpoints.default.value`
- **THEN** the rendered `<img>` resolves to `height: auto` (overriding MJML's inline `height` style) so the image scales proportionally with its width

#### Scenario: Below the default breakpoint, HTML pixel-image scales to container

- **WHEN** an email containing `HtmlPixelImageBlock` is rendered at a viewport narrower than `theme.breakpoints.default.value`
- **THEN** the rendered `<img>` resolves to `width: 100%` and `height: auto`, scaling to its parent's width instead of holding the desktop pixel size
