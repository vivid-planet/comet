## Context

`MjmlText` is currently a re-export from `@faire/mjml-react`. There is no theming for text — consumers set `fontFamily`, `fontSize`, etc. on each `MjmlText` instance manually. The theme system already supports `ResponsiveValue` and `registerStyles` for responsive styling (demonstrated by `MjmlSection`). The goal is to add a themed text component with variant support, following the established patterns.

## Goals / Non-Goals

**Goals:**
- Themed text styles (base + variants) applied automatically via `MjmlText`
- Type-safe variant system extensible via module augmentation
- Responsive typography per variant using the existing `registerStyles` + `ResponsiveValue` pattern
- Global default `fontFamily` applied via `<MjmlAll>` in `MjmlMailRoot`

**Non-Goals:**
- Per-instance responsive prop overrides on `MjmlText` (consumers use `className` + custom `registerStyles` for one-off responsive needs)
- `HtmlText` component (future work, but style key names are chosen to be CSS-compatible)
- Responsive base styles (only variants support `ResponsiveValue`; base uses plain values)

## Decisions

### Two style interfaces: `TextStyles` and `TextVariantStyles`

Base text styles (`TextStyles`) use plain values. Variant styles (`TextVariantStyles`) use `ResponsiveValue<T>` for each key. This enforces at the type level that responsive behavior is owned by variants, not the base. A plain value is a valid `ResponsiveValue`, so the merge (spread variant over base) produces `TextVariantStyles` naturally.

Properties that represent numeric CSS values (`fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`) are typed `string | number`, matching the upstream `@faire/mjml-react` prop types. A bare number means pixels for most properties, a unitless multiplier for `lineHeight`, and a numeric weight for `fontWeight`. Properties that are inherently textual (`fontFamily`, `fontStyle`, `textDecoration`, `textTransform`, `color`) remain `string`. `bottomSpacing` is `number` (always pixels).

**Alternative**: Single interface with `ResponsiveValue` everywhere. Rejected because it doesn't enforce the design rule that base styles are non-responsive, and it would complicate the `<MjmlAll fontFamily>` usage (would need `getDefaultValue()` at the MjmlMailRoot level for a base-only value).

### Style keys are CSS property names (camelCase)

The style keys (`fontFamily`, `fontSize`, `lineHeight`, etc.) match both MJML component props and React `CSSProperties` keys. This makes the theme definition renderer-agnostic — a future `HtmlText` component can consume the same theme values.

`bottomSpacing` is the exception — it's a custom key that maps to `paddingBottom` on the MJML element, gated by a boolean prop.

### Variant resolution: extracted helper, CSS via `registerStyles`

Style resolution logic (base/variant merge, `defaultVariant` fallback, `bottomSpacing` gating, `getDefaultValue()` extraction) is extracted into a pure `resolveTextStyles` helper function rather than inlined in the component body. This separates "what styles to compute" from "how to render MJML", making the core decision logic directly unit-testable without rendering. The helper is internal (not exported from the package).

The component calls `resolveTextStyles` at render time and forwards the result as props to the base `MjmlText`. The merged result is `TextVariantStyles` (all values potentially responsive). For inline props, `getDefaultValue()` extracts the default. For responsive overrides, `registerStyles` (module-level, theme-aware function) loops through all variants and emits media queries per variant class.

The `registerStyles` function receives the theme, so it can iterate `theme.text.variants` and emit CSS for each variant. No per-instance style collection is needed.

### CSS class structure (BEM)

- Block: `mjmlText`
- Variant modifier: `mjmlText--{variantName}` (e.g., `mjmlText--heading`)
- Bottom spacing modifier: `mjmlText--bottomSpacing`

The component applies: `clsx("mjmlText", variant && \`mjmlText--${variant}\`, bottomSpacing && "mjmlText--bottomSpacing", className)`

### Specificity: inline defaults + `!important` media queries

Default-breakpoint values are passed as MJML props (become inline styles). Responsive overrides use `!important` in media queries to override inline styles. This is the same pattern used by `MjmlSection` for indentation.

When no variant is active, only base styles are applied as inline props — no media queries fire (base styles are non-responsive). When a variant is active, the variant's merged responsive overrides target `.mjmlText--{variantName}` with `!important`. Since base styles never emit CSS rules, there are no base-vs-variant specificity conflicts.

### `fontFamily` in `<MjmlAll>`

`MjmlMailRoot` reads `theme.text.fontFamily` and passes it to `<MjmlAll>`. This sets the global default font for all MJML components. Individual components can still override via their own props.

### `bottomSpacing` as boolean-only prop

The `bottomSpacing` prop is a boolean. When `true`, the theme's `text.bottomSpacing` (or the resolved variant's `bottomSpacing`) is applied as `paddingBottom`. When the theme defines no `bottomSpacing`, the prop has no effect. Consumers who need a custom value can use the standard `paddingBottom` prop or custom className.

An explicit `paddingBottom` prop always wins over the theme-derived value at the default breakpoint (it's applied after theme resolution in the spread order). However, at responsive breakpoints, variant `bottomSpacing` responsive overrides use `!important` media queries that will beat an inline `paddingBottom`. This is the same trade-off that applies to all responsive variant styles — per-instance responsive overrides are out of scope (see Non-Goals). Consumers needing per-instance responsive `paddingBottom` should use `className` + custom `registerStyles`.

### Stories use `@ts-expect-error` instead of module augmentation

Storybook stories that demonstrate variants use `@ts-expect-error` comments on the theme `variants` definition and `variant` prop usage, rather than `declare module` augmentation. This keeps each story file self-contained — module augmentation would leak variant keys across all story files in the compilation, potentially masking type errors. Each `@ts-expect-error` comment explains that consumers would use module augmentation of `TextVariants`.

## Risks / Trade-offs

- **Variant CSS emitted even when unused**: `registerStyles` emits media queries for all defined variants, even if a particular email template doesn't use them all. Low risk — the CSS is small and MJML inlines what it can. → Accept; premature optimization to conditionally emit.
- **`!important` in media queries**: Required to override inline styles. Standard pattern in email development and already used by `MjmlSection`. → Accept.
- **Empty `TextVariants` interface**: When no variants are augmented, the `variant` prop type is `keyof TextVariants` which resolves to `never`. This means the prop is unusable until augmented. → Correct behavior; TypeScript prevents passing invalid variant names.
