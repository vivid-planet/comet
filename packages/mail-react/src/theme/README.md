# Theme

Without a shared theme, every component in an email would hard-code its sizes, breakpoints, colors, and text styles, leaving each consuming project with no path to override or extend any of them. `createTheme` deep-merges defaults with overrides, `ThemeProvider` distributes the result, and components read it via `useTheme`. Text styles additionally support named variants so components like `MjmlText` can pick a single `variant` instead of repeating individual style props on every usage.

## Non-goals

- No CSS variables or theme injection into a `<style>` block — tokens are read at render time and applied inline or via `registerStyles` by each consuming component.
- No runtime validation of token values — the theme is a type-checked contract.
