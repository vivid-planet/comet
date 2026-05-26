# MjmlSection

Improves on the upstream `MjmlSection` by making it easier to set theme-driven content indentation, or to keep columns side-by-side on mobile, with a single prop each. Without those props it forwards to the base component unchanged, and outside a `ThemeProvider` it stays usable as long as the theme-dependent props are not set.

## Dependencies

- [MjmlWrapper](../wrapper/README.md) — when present as an ancestor, signals this section to skip its themed background default so the wrapper's background shows through.
