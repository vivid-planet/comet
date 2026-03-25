---
"@comet/mail-react": minor
---

Add theme system with `createTheme`, `ThemeProvider`, and `useTheme`

`createTheme` produces a `Theme` with layout design tokens (`sizes.bodyWidth`, `breakpoints.default`, `breakpoints.mobile`). Pass an overrides object to customize sizes and breakpoints — breakpoint values are constructed with `createBreakpoint`. All theme interfaces support TypeScript module augmentation for project-specific extensions.

`MjmlMailRoot` now accepts an optional `theme` prop. When provided, it sets the email body width and MJML responsive breakpoint from the theme.
