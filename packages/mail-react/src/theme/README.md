# Theme

Solves the problem of keeping sizes, breakpoints, colors, and text styles consistent across every component in an email — without hard-coding them — while still letting each consuming project override any token and extend the theme with its own. Defaults are deep-merged with overrides by `createTheme`, distributed by `ThemeProvider`, and read by components via `useTheme`. Text styles additionally support named variants so components like `MjmlText` can pick a single `variant` instead of repeating individual style props on every usage.

## Non-goals

- No CSS variables or theme injection into a `<style>` block — tokens are read at render time and applied inline or via `registerStyles` by each consuming component.
- No runtime validation of token values — the theme is a type-checked contract.
