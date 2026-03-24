---
"@comet/mail-react": minor
---

Add theme system with `createTheme`, `ThemeProvider`, and `useTheme`

The theme provides design tokens for email layout dimensions (`sizes.bodyWidth`, `breakpoints.default`, `breakpoints.mobile`).
All theme interfaces support TypeScript module augmentation for project-specific extensions.

`MjmlMailRoot` now accepts an optional `theme` prop. When provided, it sets the body width and MJML responsive breakpoint from the theme.
When omitted, sensible defaults are used (`bodyWidth: 600`, `mobile breakpoint: 420`).
