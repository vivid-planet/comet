## 1. Prerequisites

- [x] 1.1 Confirm `add-config-context` is merged (`Config`, `ConfigProvider`, `useConfig`, `MjmlMailRoot.config` are available). This change consumes those primitives.

## 2. Config augmentation

- [x] 2.1 Add the optional `pixelImage: { validSizes: number[]; baseUrl: string }` member to the exported `Config` interface, with TSDoc explaining when each field is required and where it's read from.

## 3. Internal hooks

- [x] 3.1 Create `src/blocks/pixelImage/usePixelImageConfig.ts`: reads `useConfig().pixelImage`, throws when unset with a message naming the missing keys and pointing at `MjmlMailRoot.config` and `ConfigProvider`. Returns the narrowed (non-nullable) value.
- [x] 3.2 Create `src/blocks/pixelImage/usePixelImageData.ts`: takes `data: PixelImageBlockData`, `defaultRenderWidth`, `largestPossibleRenderWidth?`, returns `{ imageUrl, defaultRenderWidth, desktopImageHeight, alt, title } | null`. Internally calls `usePixelImageConfig` for `validSizes` / `baseUrl`, defaults `largestPossibleRenderWidth` to `theme.sizes.bodyWidth`, returns `null` when `data.damFile?.image` is absent. Implements the width-selection algorithm and aspect-ratio resolution from the design doc.

## 4. Block components

- [x] 4.1 Create `src/blocks/pixelImage/HtmlPixelImageBlock.tsx`: `HtmlPixelImageBlockProps = Omit<ComponentProps<"img">, "src" | "width" | "height"> & { data: PixelImageBlockData; width: number; largestPossibleRenderWidth?: number; }`. Calls `usePixelImageData`; returns `null` when the hook returns `null`; otherwise renders `<img>` with `src`, `width`, `height`, `alt`, `title` set from the resolved data and forwards remaining props. TSDoc on component and exported prop type.
- [x] 4.2 Create `src/blocks/pixelImage/MjmlPixelImageBlock.tsx`: `MjmlPixelImageBlockProps = Omit<MjmlImageProps, "src" | "width" | "height"> & { data: PixelImageBlockData; width: number; largestPossibleRenderWidth?: number; }`. Same body shape as the Html variant but renders the re-exported `MjmlImage` from `@faire/mjml-react`. TSDoc on component and exported prop type, including the constraint that it must be placed within `MjmlColumn`.

## 5. Public exports

- [x] 5.1 Export `HtmlPixelImageBlock`, `HtmlPixelImageBlockProps`, `MjmlPixelImageBlock`, `MjmlPixelImageBlockProps` from `src/index.ts`.

## 6. Storybook

- [x] 6.1 Add `src/blocks/pixelImage/__stories__/exampleBlockData.ts` with a representative `PixelImageBlockData` fixture. Mark non-API-typed fields (`null` titles / crop dimensions on SMART crop) with `@ts-expect-error` only where the generated type and runtime value disagree.
- [x] 6.2 Add `src/blocks/pixelImage/__stories__/HtmlPixelImageBlock.stories.tsx`: provides `Config` with `pixelImage` (representative `validSizes`, `baseUrl: "http://localhost:3000"`); demonstrates rendering inside `<MjmlSection indent>` + `<MjmlColumn>` + `<MjmlRaw>` so the story matches the documented usage context.
- [x] 6.3 Add `src/blocks/pixelImage/__stories__/MjmlPixelImageBlock.stories.tsx`: provides `Config` with `pixelImage`; demonstrates rendering inside `<MjmlSection indent>` + `<MjmlColumn>`. Note in the story description that the story may fail to load the image when fixtures don't include the referenced DAM file.

## 7. Tests

- [x] 7.1 Add `usePixelImageData` tests covering: width selection when an exact `validSizes` entry exists, when DPR-2 fits, when nothing qualifies (largest fallback), `width === largestPossibleRenderWidth` (DPR-2 fixed-size path), absolute vs. relative URL prefixing with `baseUrl`, SMART vs. non-SMART aspect-ratio derivation, and `null` return when `damFile.image` is absent.
- [x] 7.2 Add a test asserting the error message thrown by `usePixelImageConfig` when `config.pixelImage` is unset (asserts on the human-readable text so future refactors don't dilute it).

## 8. Lint, build, verification

- [x] 8.1 Run `pnpm run lint:fix` then `pnpm run lint` from `packages/mail-react/`; fix any remaining ESLint or TypeScript errors manually.
- [x] 8.2 Run `pnpm run test` and confirm all tests pass.
- [x] 8.3 Verify both stories load successfully in Storybook (`http://localhost:6066`).

## 9. Changeset

- [x] 9.1 Check `.changeset/` at the repo root for an existing unmerged changeset that already covers pixel-image blocks; update it if found, otherwise create a new minor changeset for `@comet/mail-react` describing the new exports from the consumer's perspective (what is now possible, with a brief usage example showing the `config.pixelImage` wiring on `MjmlMailRoot`). Follow the formatting rules in `CONTRIBUTING.md`.

## 10. Validate

- [x] 10.1 Run `pnpm --filter @comet/mail-react exec openspec validate add-pixel-image-blocks --strict` and resolve any reported issues.

## 11. Aspect-ratio override

- [x] 11.1 Add an internal `parseAspectRatio(value: number | string): number` helper to `usePixelImageData.ts`. Numbers map to `value / 1`-style direct interpretation as `width / height`. Strings split on `[x/:]`; a single token defaults height to `1`. Throws naming the offending value when parts don't resolve to positive numbers.
- [x] 11.2 Extend `usePixelImageData` to accept `aspectRatio?: number | string`. When set, parse it and use the parsed ratio for both the `$resizeHeight` URL substitution and the returned `desktopImageHeight`, replacing the cropArea-derived ratio. When unset, keep the current behavior.
- [x] 11.3 Add `aspectRatio?: number | string` to `HtmlPixelImageBlockProps` and `MjmlPixelImageBlockProps` with TSDoc covering accepted forms (`"16x9"`, `"16:9"`, `"16/9"`, numbers) and the override semantics. Forward the prop to `usePixelImageData`.

## 12. Stable class name on rendered element

- [x] 12.1 In `HtmlPixelImageBlock`, render `<img>` with `className={clsx("htmlPixelImageBlock", className)}`. Destructure `className` out of `imgProps` so the spread doesn't overwrite the merged value.
- [x] 12.2 In `MjmlPixelImageBlock`, render `MjmlImage` with `className={clsx("mjmlPixelImageBlock", className)}` (using `IMjmlImageProps.className`, which the package re-exports). Destructure `className` out of `imageProps` so the spread doesn't overwrite the merged value.

## 13. Tests

- [x] 13.1 Extend `usePixelImageData` tests to cover: number override (`16/9`), string overrides (`"16x9"`, `"16:9"`, `"16/9"`), single-token string (`"2"`), malformed string throws, and that the override applies to both the URL `$resizeHeight` and the returned `desktopImageHeight` (not just one).

## 14. Storybook

- [x] 14.1 Add a story (or story arg) on each block demonstrating the `aspectRatio` override — a single DAM image rendered at, e.g., its native ratio and at `"16x9"` for visual contrast.

## 15. Lint, build, changeset, validate

- [x] 15.1 Run `pnpm run lint:fix` then `pnpm run lint` from `packages/mail-react/`; fix any TypeScript errors manually.
- [x] 15.2 Run `pnpm run test`; confirm all tests pass.
- [x] 15.3 Update the existing `.changeset/add-mail-react-pixel-image-blocks.md` to mention the `aspectRatio` prop and the stable class names on the rendered elements.
- [x] 15.4 Run `pnpm --filter @comet/mail-react exec openspec validate add-pixel-image-blocks --strict` and resolve any reported issues.

## 16. Responsive scaling below the default breakpoint

- [x] 16.1 In `src/blocks/pixelImage/MjmlPixelImageBlock.tsx`, add a `registerStyles((theme) => …)` call that emits, inside `${theme.breakpoints.default.belowMediaQuery}`, the rule `.mjmlPixelImageBlock img { height: auto !important; }`. Use the `css` tagged template from `../../utils/css.js`. Mirror the surrounding-module placement convention from `MjmlSection.tsx` (call site at the bottom of the file).
- [x] 16.2 In `src/blocks/pixelImage/HtmlPixelImageBlock.tsx`, add a `registerStyles((theme) => …)` call that emits, inside `${theme.breakpoints.default.belowMediaQuery}`, the rule `.htmlPixelImageBlock { width: 100%; height: auto; }`. No `!important` — a class-selector rule already beats the HTML `width`/`height` presentation attributes.
- [x] 16.3 Run `pnpm run lint:fix` then `pnpm run lint` from `packages/mail-react/`; fix any TypeScript errors manually.
- [x] 16.4 Run `pnpm run test`; confirm all tests pass.
- [x] 16.5 Visually verify both stories in Storybook (`http://localhost:6066`) at viewports below `theme.breakpoints.default.value`: the MJML image scales width AND keeps its aspect ratio (height shrinks proportionally); the HTML image scales width and height to its container instead of holding the desktop pixel size.
- [x] 16.6 Run `pnpm --filter @comet/mail-react exec openspec validate add-pixel-image-blocks --strict` and resolve any reported issues.
