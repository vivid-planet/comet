## Why

MJML requires responsive CSS (media queries) to live in `<mj-style>` tags inside `<mj-head>`, but component authors should not have to edit a global file every time they need mobile-specific styles. A `registerStyles` mechanism lets each component declare its own responsive styles at the module level, which are automatically collected and rendered in the email head.

The first practical use case is content indentation on `MjmlSection`: desktop padding set via inline props, mobile padding overridden via a registered media query — demonstrating the full pattern.

## What Changes

- Add a `registerStyles(styles, mjmlStyleProps?)` function that registers component-level CSS into a module-scoped registry, using the styles value itself (function reference or `ReturnType<typeof css>` value) as the deduplication key — no manual id required. The `styles` parameter is typed with `ReturnType<typeof css>` (the existing `css` tagged template); no additional exported type alias.
- Add an internal (non-exported) component that iterates the registry and renders `<MjmlStyle>` tags, used only from `MjmlMailRoot` inside `<MjmlHead>`.
- Add a generic `ResponsiveValue<T = number>` type (`T` or object keyed by breakpoint names with required `default`) and exported helpers `getDefaultValue<T>` and `getResponsiveOverrides<T>`.
- Add `contentIndentation` of type `ResponsiveValue` (default `T` is `number`) to `ThemeSizes` (default: `{ default: 32, mobile: 16 }`), and include it in `createTheme`.
- Add an `indent` prop to `MjmlSection` that applies the default indentation value as inline padding and registers media-query overrides for each responsive breakpoint via `registerStyles`.

## Capabilities

### New Capabilities

- `register-styles`: Module-level style registration mechanism that collects component CSS and renders it in the email head, with automatic deduplication by styles identity.

### Modified Capabilities

- `theme-system`: Add generic `ResponsiveValue<T = number>` and helpers, and add `contentIndentation` of type `ResponsiveValue` to `ThemeSizes`.
- `mjml-section`: Add an `indent` boolean prop that applies the default indentation as left/right padding and registers responsive media-query overrides from the `contentIndentation` value.
- `mjml-mail-root`: Render registered styles in `<MjmlHead>` via an internal component (not exported).

## Impact

- **New exports**: `registerStyles`, generic `ResponsiveValue<T = number>`, `getDefaultValue<T>`, `getResponsiveOverrides<T>` from the main entry point. Registered-styles rendering is internal to `MjmlMailRoot` (no export of a `Styles` component or `Styles` type).
- **Theme**: `ThemeSizes` gains `contentIndentation`; existing consumers are unaffected (additive).
- **MjmlMailRoot**: Renders registered styles in the head via an internal component; no behavioral change for emails without registered styles.
- **MjmlSection**: New optional `indent` prop; existing usage unchanged.
- **No breaking changes**.
