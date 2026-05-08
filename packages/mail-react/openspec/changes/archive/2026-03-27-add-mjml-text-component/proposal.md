## Why

Email templates need consistent, themeable typography with variant support. Currently consumers must manually apply font styles to every `MjmlText` instance. A themed text component with named variants lets projects define their typography scale once and apply it consistently, with responsive overrides per variant.

## What Changes

- Add text style type system: `TextStyleMap` (source of truth), `TextStyles` (plain values for base), `TextVariantStyles` (responsive values for variants), `TextVariants` (empty interface for module augmentation), `ThemeText` (base styles + variants)
- Add internal conditional helper types (`VariantsRecord`, `VariantName`) so internal code uses string keys without casts while consumers get strict enforcement after module augmentation
- Add `text` property to `Theme` with base styles and optional variants
- Set default base text styles in the default theme: `fontFamily: "Arial, sans-serif"`, `fontSize: "16px"`, `lineHeight: "20px"`, `bottomSpacing: 16`
- Replace the `MjmlText` re-export with a custom themed component that resolves base + variant styles, applies defaults as inline props, and registers responsive overrides via `registerStyles`
- Add `variant` prop (typed via `VariantName`) and `bottomSpacing` boolean prop to `MjmlText`
- Apply `theme.text.fontFamily` to `<MjmlAll>` in `MjmlMailRoot` as the global default font

## Capabilities

### New Capabilities

- `mjml-text`: Custom `MjmlText` component with theme-based typography styles, variant support via module augmentation, `bottomSpacing` toggle, and responsive variant overrides via `registerStyles`
- `text-theme`: Theme text configuration (`ThemeText`, `TextStyleMap`, `TextStyles`, `TextVariantStyles`, `TextVariants`) with base styles, default variant, and per-variant responsive overrides

### Modified Capabilities

- `mjml-mail-root`: `<MjmlAll>` gains a `fontFamily` attribute from `theme.text.fontFamily`
- `theme-system`: `Theme` gains a `text` property of type `ThemeText`; default theme includes text defaults; `createTheme` merges `text` overrides

## Impact

- **Theme types** (`src/theme/themeTypes.ts`): New text-related interfaces and conditional helper types added to `Theme`
- **Default theme** (`src/theme/defaultTheme.ts`): Adds `text` defaults
- **createTheme** (`src/theme/createTheme.ts`): Must merge the new `text` property with defaults
- **MjmlMailRoot** (`src/components/mailRoot/MjmlMailRoot.tsx`): `<MjmlAll>` gains `fontFamily` from theme
- **MjmlText** (`src/components/text/MjmlText.tsx`): New custom component replacing the re-export
- **Exports** (`src/index.ts`): New type exports, updated component export
