## Why

Email templates need consistent, themeable typography with variant support. Currently consumers must manually apply font styles to every `MjmlText` instance. A themed text component with variants (like MUI's Typography) lets projects define their typography scale once and apply it consistently, with responsive overrides per variant.

## What Changes

- Add `TextStyles` interface (plain string/number values) for base text theme styles: `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `lineHeight`, `letterSpacing`, `textDecoration`, `textTransform`, `color`, `bottomSpacing`
- Add `TextVariantStyles` interface (same keys but `ResponsiveValue<T>`) for variant-level styles with responsive support
- Add `TextVariants` interface (empty by default, extensible via module augmentation) for consumer-defined variant names
- Add `ThemeText` interface to `Theme` with base styles, `defaultVariant`, and `variants` record
- Set default base text styles in the default theme: `fontFamily: "Arial, sans-serif"`, `fontSize: "16px"`, `lineHeight: "20px"`, `bottomSpacing: 16`
- Replace the custom `MjmlText` wrapper with a themed version that resolves base + variant styles, applies defaults as inline props, and registers responsive overrides via `registerStyles`
- Add `variant` prop (optional, typed as `keyof TextVariants`) and `bottomSpacing` boolean prop to `MjmlText`
- Apply `theme.text.fontFamily` to `<MjmlAll>` in `MjmlMailRoot` as the global default font

## Capabilities

### New Capabilities

- `mjml-text`: Custom `MjmlText` component with theme-based typography styles, variant support via module augmentation, `bottomSpacing` toggle, and responsive variant overrides via `registerStyles`
- `text-theme`: Theme text configuration (`ThemeText`, `TextStyles`, `TextVariantStyles`, `TextVariants`) with base styles, default variant, and per-variant responsive overrides

### Modified Capabilities

- `mjml-mail-root`: `<MjmlAll>` gains a `fontFamily` attribute from `theme.text.fontFamily`, changing the default attributes requirement
- `theme-system`: `Theme` gains a `text` property of type `ThemeText`; default theme includes `text.fontFamily` as `"Arial, sans-serif"`

## Impact

- **Theme types** (`src/theme/themeTypes.ts`): New `ThemeText`, `TextStyles`, `TextVariantStyles`, `TextVariants` interfaces added to `Theme`
- **Default theme** (`src/theme/defaultTheme.ts`): Adds `text` defaults (`fontFamily`, `fontSize`, `lineHeight`, `bottomSpacing`)
- **createTheme** (`src/theme/createTheme.ts`): Must deep-merge the new `text` property
- **MjmlMailRoot** (`src/components/mailRoot/MjmlMailRoot.tsx`): `<MjmlAll>` gains `fontFamily` from theme
- **MjmlText** (`src/components/text/MjmlText.tsx`): New custom component replacing the re-export
- **Exports** (`src/index.ts`): New type exports, updated component export
