---
"@comet/mail-react": minor
---

Add `ResponsiveValue<T>` type with `getDefaultFromResponsiveValue` and `getResponsiveOverrides` helpers

Generic type for breakpoint-aware theme tokens. A `ResponsiveValue` is either a plain value or an object keyed by breakpoint names with a required `default`. The helpers resolve the default value for inline styles and extract per-breakpoint overrides for media queries.

Use this when augmenting the theme with values that should vary per breakpoint, e.g. a custom `titleFontSize: ResponsiveValue`.
