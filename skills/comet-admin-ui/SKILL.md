---
name: comet-admin-ui
description: Building or editing admin UI in a project that uses @comet/admin and its sibling packages — pages, dashboards, dialogs, widgets, layouts, or component styling. Use even for small UI changes, to build with Comet's theme, components, and helpers instead of custom sx/styled CSS, hard-coded values, or Box layouts.
---

# Building admin UIs with @comet/admin

`@comet/admin` and its sibling packages ship a design system: a theme (spacing,
colors, shadows, typography, breakpoints) and a library of ready-made components. For
internationalization, the project uses `react-intl` to translate text, numbers, and dates. The
components and types are available in the consuming project through the installed packages —
import them directly (e.g. `import { Button, MainContent } from "@comet/admin"`).

Build admin UI by composing what the design system already provides. Add custom styling only
after the system genuinely can't express what you need.

## Core principle

**Prefer Comet's theme values, components, and helpers over custom styling.** Three reasons:

1. **Reviewability.** When styling lives in the theme and in components, the markup stays
   declarative and diffs stay small. A component that mixes `sx`, inline `style`, and `styled()`
   is hard to read and hard to review — the layout, the styling, and the logic blur together.
2. **Automatic upgrades.** A project's visual design is often built against a _future_ version of
   the design system, so it won't fully match what the currently installed components and theme
   produce. That gap is expected — it is not a reason to add custom styling to force the match.
   Use the current Comet components and tokens as they are; a later library upgrade closes the gap
   on its own, with no hand-written CSS to find and rework.
3. **Consistency.** Every screen built from the same components and tokens looks and behaves the
   same way.

This holds **even when a project's design deliberately differs** from the current library
defaults: prefer the Comet component or token, and apply that project-specific difference by
configuring the theme — not by re-styling individual components. Add custom styling only when
explicitly instructed, or when no component, prop, or token can produce the result.

## Decision framework

Before writing any styling or markup, work down this list and stop at the first step that applies:

1. **Is there a component for this?** Use it rather than assembling the same thing from
   `Box` + CSS (page structure, cards, toolbars, dialogs, alerts, buttons, …).
2. **Is there a prop for this?** Props apply the correct theme values with no CSS — e.g.
   `elevation` / `square` on `Paper` and `Card`, `variant` on `Button` and `Typography`,
   `spacing` on `Stack` and `Grid`.
3. **Is there a theme value for this?** Read spacing, colors, and shadows from the theme
   (`theme.spacing(n)`, `theme.palette.*`, `theme.shadows[n]`) instead of hard-coding pixels,
   hex colors, or shadow strings.
4. **Is there a helper for this?** User-facing text, numbers, and dates go through the i18n
   helpers (`FormattedMessage`, `FormattedNumber`, `FormattedDate`), never hard-coded.
5. **Only then, custom-style** — using `styled()` (not `sx` or inline `style`) and reading
   values from the theme.

## Styling and theme

### Custom styling: `styled()`, not `sx` or inline `style`

When you do need custom styling, write it with `styled()` from `@mui/material/styles` and give the
result a name that says what it is. Styling in `sx` props or inline `style` mixes the look into the
markup, so layout, styling, and logic blur together and the diff is harder to follow. A named
styled component keeps the markup declarative and the styling in one place.

```tsx
// Avoid — sx and inline style mixed into the markup
<Box sx={{ padding: 2, backgroundColor: "#fff", borderRadius: 1 }} style={{ marginTop: 16 }}>
    {children}
</Box>;

// Prefer — a named styled component, styling separated from markup
const Panel = styled("div")`
    padding: ${({ theme }) => theme.spacing(2)};
    background-color: ${({ theme }) => theme.palette.background.paper};
`;

<Panel>{children}</Panel>;
```

Move the styles to a private `*.sc.ts` sibling once a component grows several styled parts.

### Spacing and color: theme tokens, not hard-coded values

Read spacing and color from the theme instead of typing pixels and hex codes. The theme is the
single place those values are defined, so reading from it keeps every screen consistent and lets a
theme change reach all of them at once. Comet's spacing base is `5px` — `theme.spacing(1)` is `5px`,
`theme.spacing(2)` is `10px` — and it takes up to four arguments for top, right, bottom, and left.

```tsx
// Avoid — hard-coded pixels and colors
const Header = styled("header")`
    padding: 16px 24px;
    color: #1a1a1a;
    border-bottom: 1px solid #e0e0e0;
`;

// Prefer — spacing and palette tokens from the theme
const Header = styled("header")`
    padding: ${({ theme }) => theme.spacing(2, 3)};
    color: ${({ theme }) => theme.palette.text.primary};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;
```

Use the palette tokens — `primary`, `secondary`, `error`, `warning`, `info`, `success`,
`grey[50…900]`, `divider`, `text`, `background`, `action` — rather than naming raw colors.

### Elevation and shape: `elevation` and `square`, not manual CSS

Shadows and corner radius come from props on `Paper` and `Card`, not hand-written CSS. Comet defines
four shadow elevations (1–4); higher values are `none`. The `elevation` prop selects one, and the
`square` prop toggles the rounded corner. Read `theme.shadows[n]` directly only inside a `styled()`
component that cannot be a `Paper` or `Card`.

```tsx
// Avoid — manual shadow and radius on a plain element
<div style={{ boxShadow: "0 0 8px rgba(0,0,0,0.1)", borderRadius: 4 }}>{children}</div>

// Prefer — a Paper carrying the theme's elevation and shape
<Paper elevation={2}>{children}</Paper>
```

### Typography: `<Typography variant>`, not manual font CSS

Render text through `<Typography>` with a variant rather than setting font size, weight, and line
height by hand. The variant carries the type scale and its responsive steps, so headings and body
text stay in proportion across breakpoints. Available variants: `h1`–`h6`, `body1`, `body2`,
`subtitle1`, `subtitle2`, `caption`, `overline`, `list`, `listItem`, `button`.

```tsx
// Avoid — font properties set by hand
const Title = styled("h2")`
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
`;

// Prefer — a Typography variant from the type scale
<Typography variant="h4">{title}</Typography>;
```
