## Context

Email development follows a **default-first** model: the base rendering must work with inline styles alone, because the worst-case clients (typically desktop — e.g. Outlook) strip or ignore `<style>` blocks entirely. Media queries are a progressive enhancement targeting mobile viewports, which generally have good CSS support. This is why the theme provides `max-width` media queries named `belowMediaQuery` — they target viewports _below_ a breakpoint, enhancing the mobile experience on top of a correct inline-styles default.

MJML encodes this model structurally: component props (padding, width, etc.) become inline styles in the final HTML, while responsive CSS lives in `<mj-style>` tags inside `<mj-head>`. Today, `MjmlMailRoot` renders the head/body skeleton but has no mechanism for components in the body to contribute styles to the head.

The rendering pipeline is `React → renderToStaticMarkup → MJML string → mjml2html → HTML`. `renderToStaticMarkup` is synchronous and depth-first: `<MjmlHead>` serializes completely before `<MjmlBody>` begins. This means styles must be known before the render pass starts.

## Goals / Non-Goals

**Goals:**

- Let component authors declare responsive CSS alongside their component, without editing a global file.
- Provide a simple, no-id-required API for registering styles.
- Add theme-based content indentation to `MjmlSection` as the first consumer of this mechanism.

**Non-Goals:**

- Render-time style collection (hooks, context-based collection, two-pass rendering) — the module-level approach is sufficient and simpler.
- A general-purpose CSS-in-JS solution — this is specifically for MJML `<mj-style>` injection.
- Scoped/isolated styles — component authors are responsible for using unique class names (same as raw MJML).

## Decisions

### Decision 1: Module-level registry with styles-identity keying

`registerStyles` stores entries in a module-scoped `Map` where the key is the styles value itself — the function reference for function styles, or the `ReturnType<typeof css>` value for static CSS entries.

**Why this over an explicit id:**

- Function references defined at module scope are stable (created once per module load), making them natural unique keys.
- String styles use content equality — identical CSS deduplicates automatically.
- No manual id to coordinate across components, eliminating a class of bugs (typos, accidental collisions).

**Why this over render-time collection (hooks / context):**

- `renderToStaticMarkup` serializes `<MjmlHead>` before `<MjmlBody>`, so styles must exist before the render pass.
- Render-time collection would require either two-pass rendering or MJML string post-processing — both add complexity with no practical benefit for email generation.
- Module-level side effects are the natural pattern: importing a component file registers its styles, and module caching ensures each registration runs exactly once.

**Alternatives considered:**

- _Explicit string id_: Works but adds manual coordination burden. The id's only unique benefit — HMR deduplication — is a minor cosmetic concern.
- _Auto-incrementing counter_: Simpler but loses deduplication entirely on HMR.
- _Two-pass rendering_: Most "correct" but doubles render cost and requires coupling style collection into `renderMailHtml`.

### Decision 2: registerStyles payload and internal rendering

`registerStyles` is typed as `ReturnType<typeof css> | ((theme: Theme) => ReturnType<typeof css>)`, referencing the existing `css` export — no extra exported type alias. When a function, it is evaluated at render time inside an internal head component that has access to `useTheme()`. That component is not exported; only `registerStyles` is added to the public API for this feature (alongside the pre-existing `css`).

### Decision 3: Generic ResponsiveValue for breakpoint-aware theme tokens

Breakpoint-aware theme values use a generic type:

`ResponsiveValue<T = number> = T | (Partial<Record<keyof ThemeBreakpoints, T>> & { default: T })`

- `T` is the value carried at each breakpoint (pixels as `number` today; later e.g. `string` for CSS lengths like `"24px"` or line-height).
- The default type parameter is `number`, so bare `ResponsiveValue` means numeric responsive values. Do not write `ResponsiveValue<number>` when it only repeats the default; use `ResponsiveValue<string>` (or another `T`) only when the value type is not `number`.
- `ThemeSizes.contentIndentation` is typed as `ResponsiveValue` (same as `ResponsiveValue<number>` via the default).
- A plain `T` value is shorthand for `{ default: <T> }` — inline only, no responsive overrides.
- The object form requires `default` and optional keys matching `ThemeBreakpoints` (including augmented keys). Each non-`default` key pairs with that breakpoint's `belowMediaQuery`.

Two exported generic helpers:

- `getDefaultValue<T = number>(value: ResponsiveValue<T>): T`
- `getResponsiveOverrides<T = number>(value: ResponsiveValue<T>): Array<{ breakpointKey: string; value: T }>`

**Why generic from v1:** Future tokens (e.g. line-height) may use `ResponsiveValue<string>` without renaming the pattern or shipping a second parallel type. Numeric tokens use bare `ResponsiveValue` on the theme; non-numeric tokens spell `ResponsiveValue<…>` explicitly.

**Why exported helpers:** Consumers building custom responsive components reuse the same resolution logic; generics keep overrides type-aligned with `T`. Overrides are returned as `{ breakpointKey, value }` objects rather than tuples for readability and safer iteration.

### Decision 4: `indent` as opt-in boolean

`MjmlSection`'s new prop is `indent: boolean` (default `false`), not `disableIndentation` (opt-out). For a general-purpose library, indentation should be an explicit choice — consumers decide which sections have content padding.

### Decision 5: `registerStyles` called at module scope in MjmlSection

The section component registers its indentation styles at module scope. The registered style function resolves `theme.sizes.contentIndentation` via `getResponsiveOverrides`, then dynamically generates a media query for each non-`default` breakpoint key, targeting the `mjmlSection--indented` class. This means the responsive CSS is always present in the head (once the module is imported), but only takes effect on elements with the matching class.

## Risks / Trade-offs

- **HMR style accumulation** → During Storybook hot-module-replacement, function styles may accumulate stale entries because each HMR cycle creates a new function reference. The effect is cosmetic only (duplicate identical CSS in the output). Mitigation: acceptable for development; no impact on production renders. String styles are unaffected (content-based dedup).
- **Global class name responsibility** → Component authors must choose unique class names for their CSS selectors. No automatic scoping. Mitigation: document the convention; this matches how MJML itself works.
- **All imported styles are global** → Importing a component registers its styles regardless of whether it's rendered. Extra CSS in `<mj-style>` adds bytes but is functionally harmless. Mitigation: email templates typically import few components; overhead is negligible.
