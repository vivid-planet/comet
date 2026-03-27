---
"@comet/mail-react": minor
---

Add themed `MjmlText` component with `variant` and `bottomSpacing` props

`MjmlText` accepts optional `variant` and `bottomSpacing` props; typography is driven by the theme so you do not repeat font and spacing attributes on every block.

Configure text styles under `theme.text`: base typography (`fontFamily`, `fontSize`, `lineHeight`, spacing), optional named variants, and `defaultVariant` for text without an explicit variant.

`MjmlMailRoot` applies the theme text `fontFamily` as the default for the whole email.
