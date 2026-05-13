## Context

`PixelImageBlockData` is already declared in `src/blocks.generated.ts`. Resolving it to a concrete `<img src>` requires:

1. picking a width from a list of API-allowed sizes (`validSizes` — typically `cometConfig.images.imageSizes` + `deviceSizes`),
2. computing the aspect-ratio from the DAM crop area,
3. interpolating `urlTemplate` (which contains `$resizeWidth` / `$resizeHeight` placeholders),
4. prefixing a `baseUrl` when the resolved URL is relative.

`validSizes` and `baseUrl` are environment / project-specific runtime values. They do not belong in the visual `Theme`, but they need to flow down the React tree to every pixel-image render. The companion change `add-config-context` introduces a separate `Config` context for exactly this purpose. This change is the first consumer of that primitive.

## Goals / Non-Goals

**Goals:**
- Drop-in block components for `PixelImageBlockData` in both raw HTML and MJML contexts.
- DPR-aware width selection so high-DPI displays receive an appropriately sized image.
- Clear, single-source-of-truth runtime configuration via `Config` — no `validSizes` / `baseUrl` props on every render site.
- Type-safe known key on `Config` (`pixelImage`) without forcing all consumers to provide it.

**Non-Goals:**
- A general-purpose `HtmlImage` component (out of scope; renders an `<img>` tag inline within `HtmlPixelImageBlock`).
- A custom `MjmlImage` wrapper. The re-exported `MjmlImage` from `@faire/mjml-react` is sufficient.
- Section/column wrapping behavior (`renderAsSection`, `slotProps.section`/`column`, `disableSectionIndentation`). Callers compose `MjmlSection` + `MjmlColumn` themselves.
- Linkable images (`href`/`target` wrapping). Out of scope for this change.
- Default fallback for `width` derived from theme. `width` is always required (see Decisions).
- SVG / video / DAM-image-block parents. Those types in `blocks.generated.ts` are out of scope.

## Decisions

### D1. Read `validSizes` and `baseUrl` from `Config`, not props

**Decision.** Both block components read the `pixelImage` group from `useConfig()` and throw a clear error if it isn't set.

**Why.** Every render site of `MjmlPixelImageBlock` / `HtmlPixelImageBlock` in a typical email template needs the same `validSizes` and `baseUrl`. Threading them as props duplicates wiring at every call site and makes refactors painful. `Config` (introduced by `add-config-context`) exists to carry exactly this kind of environment-specific data.

**Alternatives considered.**
- *Required props.* Matches a stricter "explicit dependencies" stance, but loses the ergonomics that motivated `Config` in the first place.
- *Optional props with `Config` fallback.* Adds API surface for a niche override; can be added later if it ever proves necessary. Start simple.

### D2. Declare `pixelImage` as a known key on `Config` via interface declaration merging

**Decision.** Add `pixelImage?: { validSizes: number[]; baseUrl: string }` to the exported `Config` interface — it lives in this change because it's only meaningful with the components shipped here.

**Why.** Keeps the `add-config-context` change focused on the primitive (provider, hook, augmentable interface). Each downstream block lands its own key alongside the components that consume it. Interface declaration merging means both keys (library-shipped and consumer-augmented) coexist seamlessly.

**Alternatives considered.**
- *Add the key in `add-config-context`.* Couples the primitive to one specific consumer; would need similar additions for every future block (DAM video, SVG image, …). Per-block placement scales better.
- *Use module augmentation from inside this package.* Functionally equivalent but harder to find. Declaring in the interface directly keeps the canonical shape in one place.

### D3. Throw inside an internal `usePixelImageConfig` accessor

**Decision.** A small internal hook reads `useConfig().pixelImage` and throws a descriptive error when missing; the block components consume the narrowed (non-nullable) result.

**Why.** Centralizes the failure mode and the error message. Components stay readable. Mirrors how `useTheme()` handles the "missing provider" case at the seam.

**Error message.** Names the offending block, points at `MjmlMailRoot.config` and `ConfigProvider`, and lists the required keys. Keeps debugging cheap when the only thing missing is wiring.

### D4. `width` is required on both block variants

**Decision.** Both `HtmlPixelImageBlockProps` and `MjmlPixelImageBlockProps` declare `width: number` as required. No theme-derived fallback.

**Why.** Without a section-aware variant, the block can't know what column width it's rendering into. Asking the caller to state the width matches their actual layout knowledge and avoids ambiguous renders. `largestPossibleRenderWidth` remains optional and defaults to `theme.sizes.bodyWidth`.

**Alternatives considered.**
- *Default to body width minus content indentation.* Only correct in narrow cases (full-width sections); silently wrong elsewhere.

### D5. `largestPossibleRenderWidth` defaults to `theme.sizes.bodyWidth`

**Decision.** When the caller doesn't specify `largestPossibleRenderWidth`, fall back to `theme.sizes.bodyWidth` — the maximum width any image in the email can render at.

**Why.** The default holds for the common case of an image rendered full-width on desktop. The mobile viewport is narrower than `bodyWidth` (even after subtracting any content indentation), so a full-width desktop image doesn't grow on mobile and `bodyWidth` is a safe upper bound.

The override exists for the opposite shape: when the desktop render width is *smaller* than the width the image can stretch to on a narrower breakpoint. Canonical example — an image inside one of two columns at 300px on desktop where the columns stack on mobile, giving the image ~420px of horizontal space. The desktop render width (300px) understates how large the image will actually display, so the caller passes `largestPossibleRenderWidth={420}` to signal the true upper bound for source-size selection.

### D6. Width-selection algorithm

**Decision.** Reuse the algorithm from existing pixel-image utilities:
- If `defaultRenderWidth === largestPossibleRenderWidth`: pick `largestPossibleRenderWidth * 2` (DPR-2 fixed-size case).
- Otherwise: walk `validSizes` in ascending order and pick the first `validWidth >= defaultRenderWidth * 2`.
- Fall back to the largest valid size when none qualifies.

**Why.** Battle-tested logic that produces sharp images on retina displays without over-fetching; matches the behavior consumers see today in equivalent custom implementations.

### D7. Aspect ratio derived from DAM crop area

**Decision.** When `cropArea.focalPoint === "SMART"`, use the natural image aspect ratio. Otherwise derive aspect ratio from `cropArea.width × image.width` over `cropArea.height × image.height`. Throw when crop dimensions are missing for a non-SMART focal point — that's a malformed DAM record, not a runtime branch we should silently handle.

**Why.** Matches DAM semantics: SMART means "use the whole image with focal-point cropping"; the other focal points define a sub-region whose dimensions are stored as percentages.

### D8. Render `<img>` directly in `HtmlPixelImageBlock`

**Decision.** No intermediate `HtmlImage` component. The Html block renders `<img>` directly with `alt` / `title` from the DAM file and forwards arbitrary `<img>` props.

**Why.** No other consumer needs an `HtmlImage` primitive today. Keeping it inline avoids exporting a barely-justified component and matches the smallest-useful-thing principle.

### D9. Render via re-exported `MjmlImage` in `MjmlPixelImageBlock`

**Decision.** `MjmlPixelImageBlock` renders the existing re-exported `MjmlImage` from `@faire/mjml-react` — no custom wrapper.

**Why.** All features the pixel-image block needs (`src`, `width`, `height`, `alt`, `title`, plus pass-through props) already exist on the base. Wrapping would add zero value.

### D10. File location: `src/blocks/pixelImage/`

**Decision.** Block implementations live under `src/blocks/pixelImage/` rather than `src/components/pixelImage/`.

**Why.** These are CMS-data-driven block renderers, not generic visual primitives. Keeping them next to existing block factories (`src/blocks/factories/`) clarifies intent and discoverability.

### D11. Return `null` when `damFile.image` is absent

**Decision.** If `data.damFile?.image` is missing, both blocks render nothing.

**Why.** Mirrors the existing semantics of similar implementations and avoids surprising consumers with a broken `<img>` for incomplete records. Width/URL resolution is impossible without the underlying image dimensions.

### D12. `aspectRatio` prop accepts `number | string`, overrides crop-derived ratio when set

**Decision.** Both blocks accept `aspectRatio?: number | string`. When set, the parsed numeric ratio replaces the DAM-derived ratio for both purposes: the URL `$resizeHeight` substitution and the rendered `height` attribute.

- `number` — interpreted as `width / height` directly (e.g., `16/9`, `1.7778`, `2`).
- `string` — parsed by splitting on `x`, `:`, or `/`. Accepted forms: `"16x9"`, `"16:9"`, `"16/9"`.
- A bare numeric string (`"2"`) is interpreted as `width / 1`.
- A malformed string (parts that don't parse to positive numbers) throws an error naming the offending value.

When omitted, the block falls back to the cropArea-derived ratio described in D7 (current behavior).

**Why.** Authors render the same DAM image at multiple aspect ratios across templates — a 16:9 hero in one layout, a 1:1 thumbnail in another. The DAM crop area is per-image, not per-render-site, so it can't express that. Letting the caller override at the JSX seam keeps DAM crops as the default while leaving room for layout-specific reframings.

**Why no `"inherit"` literal.** `undefined` already means "fall back to DAM cropArea". A keyword adds API surface without expanding behavior.

**Why these string separators.** `x`, `:`, and `/` all show up in author-friendly notation (`"16x9"`, `"16:9"`, `"16/9"`). CSS-native spaced form (`"16 / 9"`) is intentionally not supported in v0 — easy to add later if it ever proves necessary; not adding now to keep parsing logic narrow and the test surface small.

**Alternatives considered.**
- *Number-only.* Cleaner type, but `aspectRatio={16/9}` reads worse than `aspectRatio="16x9"` at the call site, and authoring ergonomics matter for a prop consumed at every block render site.
- *Override only the URL crop, not the rendered height.* Would create a visual mismatch between the fetched image and the box it's rendered into. The override has to apply to both consistently.

### D13. Always-applied stable class name on rendered elements

**Decision.** Both blocks always render their underlying element with a fixed class name — `htmlPixelImageBlock` for the `<img>` produced by `HtmlPixelImageBlock`, `mjmlPixelImageBlock` for the `MjmlImage` produced by `MjmlPixelImageBlock`. Caller-supplied `className` is merged with the stable class via `clsx("htmlPixelImageBlock", className)` (and the equivalent for MJML).

For the MJML variant, the prop is passed via `className` on `IMjmlImageProps` (which `@faire/mjml-react` exposes alongside `cssClass`); using `className` keeps the API symmetric with the HTML variant.

**Why.** Mirrors the pattern in `HtmlInlineLink`. Gives consumers a stable selector for project-level CSS — e.g., a `registerStyles` block targeting all pixel-image renders — without forcing them to thread a className through every call site. Without this, every consumer reinvents the same convention.

**Alternatives considered.**
- *Caller-only `className`.* Loses the stable hook; every project ends up adding the same class manually at every render site.
- *Use the React component display name as the class.* Couples styling to React internals that can shift across builds; not stable enough to expose as a CSS contract.

### D14. Scale rendered images below the default breakpoint via `registerStyles`

**Decision.** Each block module registers a `theme.breakpoints.default.belowMediaQuery` rule keyed off its stable class:

- `MjmlPixelImageBlock` → `.mjmlPixelImageBlock img { height: auto !important; }`. Targets the `<img>` inside the table that MJML emits for `<mj-image>` (the `mjmlPixelImageBlock` class lands on the wrapping table because `@faire/mjml-react` forwards `className` as MJML's `css-class`). `!important` is required to override the inline `height: <px>` MJML writes onto the `<img>` style attribute — without it, the image scales width but keeps a fixed pixel height, distorting aspect ratio.
- `HtmlPixelImageBlock` → `.htmlPixelImageBlock { width: 100%; height: auto; }`. Targets the `<img>` directly (the class lives on the rendered `<img>`). No `!important`: a regular CSS rule already beats the HTML `width` / `height` presentation attributes, and the block does not emit inline `style` overrides.

**Why `default.below`, not `mobile.below`.** Below the default breakpoint the body width is wider than the viewport — the moment fixed-pixel image dimensions begin overflowing. `mobile.below` would leave a dead zone between the two breakpoints where images still overflow. `default.below` covers the full responsive range cleanly, including the mobile sub-range.

**Why `registerStyles`, not inline / per-render styles.** The rules are class-keyed and identical for every render site. Registering once per module mirrors the pattern in `MjmlSection.tsx` and other components in the package, and keeps the rules deduplicated regardless of how many pixel-image blocks an email contains. The package only emits styles via `MjmlMailRoot` (no non-MJML-root mails), so `<MjmlStyle>` is sufficient for both blocks.

**Alternatives considered.**
- *Inline styles on the rendered element.* Forces every render site to ship the same fluid CSS via inline attributes, inflating payload and bypassing the `registerStyles` head-deduplication.
- *Compute responsive widths in `usePixelImageData` and emit per-render breakpoint markup.* Doable but heavier than the actual problem, which is a CSS sizing concern at runtime, not a render-time data concern.

## Risks / Trade-offs

- *Throwing on missing `config.pixelImage` is a runtime failure, not a build-time check.* → The error message points at exactly what to wire; the typical wiring lives in one place (the root layout / `MjmlMailRoot`). A unit test asserts the error text so future refactors don't dilute it.
- *`validSizes` is shared across all pixel-images in the email.* → Matches how Comet's image API is configured in practice (one `cometConfig.images` per project). If a future need emerges for per-block override, an optional prop can layer on top without breaking the context-first default.
- *`add-config-context` must merge before this change can ship.* → Tasks reference the dependency explicitly. The block components are unusable without `Config`, so they cannot be ordered the other way around.
- *No section-aware ergonomics in v0.* → Callers must wrap with `MjmlSection` / `MjmlColumn` themselves. Acceptable trade-off for a smaller, simpler API; section-wrapping support can be added later as additive optional props if it proves common.
