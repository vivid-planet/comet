## Context

`MjmlText` is currently a re-export from `@faire/mjml-react`. There is no theming for text — consumers set `fontFamily`, `fontSize`, etc. on each `MjmlText` instance manually. The theme system already supports `ResponsiveValue` and `registerStyles` for responsive styling (demonstrated by `MjmlSection`). The goal is to add a themed text component with variant support, following the established patterns.

The previous implementation attempt (PR #5389) achieved functional parity but suffered from poor code quality: excessive `as` type assertions, `any` usage, and dynamic key iteration that fought the type system. This design prioritizes type safety and readability.

## Goals / Non-Goals

**Goals:**
- Themed text styles (base + variants) applied automatically via `MjmlText`
- Type-safe variant system extensible via module augmentation
- Responsive typography per variant using the existing `registerStyles` + `ResponsiveValue` pattern
- Global default `fontFamily` applied via `<MjmlAll>` in `MjmlMailRoot`
- Zero `as` type assertions and zero `any` usage

**Non-Goals:**
- Per-instance responsive prop overrides on `MjmlText` (consumers use `className` + custom `registerStyles` for one-off responsive needs)
- `HtmlText` component (future work, but style key names are chosen to be CSS-compatible)
- Responsive base styles (only variants support `ResponsiveValue`; base uses plain values)

## Decisions

### Shared TextStyleMap as single source of truth for property types

Both `TextStyles` (plain values for base theme) and `TextVariantStyles` (responsive values for variants) are derived from a single `TextStyleMap` interface via mapped types. This ensures the two types cannot drift apart — adding a new text property requires changing only `TextStyleMap`.

`TextStyleMap` defines the CSS property names and their value types. `TextStyles` maps each key to its plain type (`T`). `TextVariantStyles` maps each key to `ResponsiveValue<T>`. Since a plain `T` is a valid `ResponsiveValue<T>`, base styles are directly assignable to variant-level types.

**Alternative**: Two independent interfaces with duplicated property lists. Rejected because they could drift apart and would require manual synchronization.

### CSS properties that require units are typed as `string` only

`TextStyleMap` uses `string` for properties where a bare number would produce invalid CSS (`fontSize`, `letterSpacing`), and `string | number` only for properties where unitless numbers are valid CSS (`fontWeight`, `lineHeight`). This makes invalid states unrepresentable at the type level — `fontSize: 16` is a type error, forcing the consumer to write `fontSize: "16px"`.

`fontWeight` keeps `string | number` because theme authors naturally write `fontWeight: 700` (valid CSS). `IMjmlTextProps.fontWeight` accepts only `string`, so the component converts via `String()` — a runtime function call, not a type assertion.

**Alternative**: Allow `string | number` for all properties and auto-append `px` for numeric values at runtime. Rejected because it introduces implicit behavior (`1` → `"1px"` could surprise someone who intended `"1rem"`) and requires the conversion logic in two places (inline props and responsive CSS generation).

### Spread-based merge for base + variant styles

When a variant is active, its styles are merged over the base using object spread: `{ ...base, ...variantStyles }`. This works without casts because `TextStyles` (where each property is `T | undefined`) is structurally assignable to `TextVariantStyles` (where each property is `ResponsiveValue<T> | undefined`), since `T` is a valid `ResponsiveValue<T>`.

The spread result is typed as `TextVariantStyles`. No per-property enumeration is needed for the merge itself.

**Alternative**: Per-property merge with explicit null coalescing for each key. Rejected because the spread achieves the same result with less code and the type system validates it.

### Explicit per-property inline prop extraction via `getDefaultOrUndefined`

Extracting default values from `TextVariantStyles` into `IMjmlTextProps` cannot use dynamic key iteration without `as any` — TypeScript cannot correlate a dynamic key's type inside a loop (a known TS limitation with correlated types). Instead, each property is extracted individually with a `getDefaultOrUndefined` helper.

This is more verbose (one line per property) but each line is individually type-checked with zero assertions. The helper is a small internal utility: `getDefaultOrUndefined<T>(value: ResponsiveValue<T> | undefined): T | undefined`.

### Conditional types for variant record and variant name

`TextVariants` is an empty interface for module augmentation. When empty, `keyof TextVariants` is `never`, making mapped types like `{ [K in keyof TextVariants]?: TextVariantStyles }` resolve to `{}` — which cannot be indexed with a string.

To avoid casts, conditional helper types are used:

- `VariantsRecord`: `keyof TextVariants extends never ? Record<string, TextVariantStyles> : { [K in keyof TextVariants]?: TextVariantStyles }`
- `VariantName`: `keyof TextVariants extends never ? string : keyof TextVariants`

Without augmentation, internal code uses `Record<string, TextVariantStyles>` (no cast for string key access). With augmentation, consumers get strict enforcement on both `createTheme` variant keys and the `variant` prop. This is used inside `ThemeText` for the `variants` and `defaultVariant` properties.

**Alternative**: Using `Record<string, TextVariantStyles>` unconditionally. Rejected because it loses consumer type safety — typos in variant names would not be caught at compile time.

### Breakpoint-grouped CSS generation with `collectOverride` helper

A generic `collectOverride<T>` helper collects responsive overrides grouped by breakpoint into a `Map<breakpointKey, CssDeclaration[]>`. Each call site infers `T` independently, making every call type-safe.

CSS output groups all property overrides into a single `@media` block per breakpoint per variant, rather than one block per property. This produces cleaner CSS and fewer bytes.

`bottomSpacing` responsive overrides use a compound selector `.mjmlText--bottomSpacing.mjmlText--{variant}` (separate from style overrides that target `.mjmlText--{variant} > div`), so they are collected into a separate map and emitted with their own selector.

### CSS class structure (BEM)

- Block: `mjmlText`
- Variant modifier: `mjmlText--{variantName}`
- Bottom spacing modifier: `mjmlText--bottomSpacing`

The component applies: `clsx("mjmlText", variant && \`mjmlText--${variant}\`, bottomSpacing && "mjmlText--bottomSpacing", className)`

### Specificity: inline defaults + `!important` media queries

Default-breakpoint values are passed as MJML props (become inline styles). Responsive overrides use `!important` in media queries to override inline styles. This is the same pattern used by `MjmlSection` for indentation.

### `fontFamily` in `<MjmlAll>`

`MjmlMailRoot` reads `theme.text.fontFamily` and passes it to `<MjmlAll>`. This sets the global default font for all MJML components. Individual components can still override via their own props.

### `bottomSpacing` as boolean-only prop

The `bottomSpacing` prop is a boolean. When `true`, the theme's `text.bottomSpacing` (or the resolved variant's `bottomSpacing`) is applied as `paddingBottom`. Consumers who need a custom value can use the standard `paddingBottom` prop or custom className.

### Stories use `@ts-expect-error` instead of module augmentation

Storybook stories that demonstrate variants use `@ts-expect-error` comments on the theme `variants` definition and `variant` prop usage, rather than `declare module` augmentation. This keeps each story file self-contained — module augmentation would leak variant keys across all story files in the compilation.

## Risks / Trade-offs

- **Variant CSS emitted even when unused**: `registerStyles` emits media queries for all defined variants, even if a particular email template doesn't use them all. Low risk — the CSS is small and MJML inlines what it can. → Accept; premature optimization to conditionally emit.
- **`!important` in media queries**: Required to override inline styles. Standard pattern in email development and already used by `MjmlSection`. → Accept.
- **Per-property extraction verbosity**: Extracting inline props requires one line per text style property. This is more verbose than a loop but provides full type safety. → Accept; readability and safety outweigh brevity.
- **Conditional types add complexity to type definitions**: The `VariantsRecord` and `VariantName` conditional types are less obvious than simple mapped types. → Accept; they eliminate all casts in the implementation and the types are well-documented via TSDoc.
- **`MjmlAll fontFamily` changes default attributes**: The existing spec says `<mj-attributes>` contains only `<mj-all padding="0" />`. Adding `fontFamily` changes this. → The spec modification captures this explicitly.
