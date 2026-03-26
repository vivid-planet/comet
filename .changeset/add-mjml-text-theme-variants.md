---
"@comet/mail-react": minor
---

Add theme-based text styling and variant support to `MjmlText`

`MjmlText` now reads typography styles (font size, weight, line height, etc.) from the theme and supports named variants via module augmentation of `TextVariants`. Variants can define responsive overrides that emit media queries automatically.

New theme types: `TextStyles`, `TextVariantStyles`, `TextVariants`, `ThemeText`.

`MjmlMailRoot` now applies `theme.text.fontFamily` as the global default font via `<MjmlAll>`.
