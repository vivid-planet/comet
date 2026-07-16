---
name: comet-admin-ui
description: Building or editing admin UI in a project that uses @comet/admin and its sibling packages — pages, dashboards, dialogs, widgets, layouts, or component styling. Use even for small UI changes, to build with Comet's theme, components, and helpers instead of custom sx/styled CSS, hard-coded values, or Box layouts.
---

# Building admin UIs with @comet/admin

`@comet/admin` and its sibling packages ship a design system: a theme (spacing,
colors, shadows, typography, breakpoints) and a library of ready-made components. For
internationalization, Comet recommends `react-intl` (the default) to translate text, numbers, and
dates. The components and types are available in the consuming project through the installed
packages — import them directly (e.g. `import { Button, MainContent } from "@comet/admin"`).

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

## Organizing styled components

By default, define a component's styled parts at the bottom of its own file, below the component
that uses them:

```
imports → types → component → styled components
```

When a file grows hard to read, refactor the component itself first — split it into smaller
components and compose them, each keeping its own styled parts at the bottom. Move styles to a
separate `*.sc.ts` sibling only when you are asked to, or when the styles grow but the component
cannot be split logically. A `*.sc.ts` file is private to its equally-named component
(`FooButton.sc.ts` belongs to `FooButton.tsx`). Don't import one component's `*.sc.ts` from another:
that couples them through styling neither owns. When styling is shared, give it a single owner — a
reusable component (below).

When the same styled component is used by several components, it is no longer a styled part of any
one of them. Promote it to its own reusable component: one export per file, named exactly as that
export so it is easy to find, e.g. `SpecialButton.ts` exporting
`export const SpecialButton = styled(Button)`. Group several small related ones into a single
generically-named file only when explicitly instructed.

## Internationalization

Comet recommends `react-intl` (the default). When a project uses it, its user-facing text,
numbers, and dates go through the `react-intl` helpers instead of being hard-coded.

### Text: `<FormattedMessage>` and `useIntl`, not literals

Use `<FormattedMessage>` wherever a ReactNode fits. String attributes (`alt`, `placeholder`,
`title`, `aria-*`) take a string, not a ReactNode, so translate those with
`useIntl().formatMessage()`.

```tsx
// Avoid — hard-coded user-facing text
<Button>Save</Button>;
<img src={src} alt="Preview" />;

// Prefer — translate through react-intl (formatMessage for string attributes)
import { FormattedMessage, useIntl } from "react-intl";

<Button>
    <FormattedMessage id="product.save" defaultMessage="Save" />
</Button>;

const intl = useIntl();
<img src={src} alt={intl.formatMessage({ id: "product.previewAlt", defaultMessage: "Preview" })} />;
```

Interpolate runtime values with `values` rather than concatenating strings, and pluralize with ICU
syntax rather than by hand:

```tsx
<FormattedMessage id="product.greeting" defaultMessage="Welcome, {name}" values={{ name }} />;

// # is the formatted count
<FormattedMessage id="product.cartCount" defaultMessage="{count, plural, one {# item in cart} other {# items in cart}}" values={{ count }} />;
```

### Numbers: `<FormattedNumber>` / `intl.formatNumber()`

Format plain numbers, currency, and percentages through react-intl so grouping, decimals, and
symbols follow the active locale rather than a hand-written format.

```tsx
// Avoid — raw or hand-formatted numbers (no locale grouping, decimals, or symbol)
<span>{count}</span>;
<span>{`${price.toFixed(2)} €`}</span>;
<span>{`${Math.round(ratio * 100)}%`}</span>;

// Prefer — locale-aware grouping and decimals, currency, and percent
<FormattedNumber value={count} />;
<FormattedNumber value={price} style="currency" currency="EUR" />;
<FormattedNumber value={ratio} style="percent" />;
```

### Dates and times: `<FormattedDate>` / `<FormattedTime>`

Render dates and times through react-intl so they follow the active locale rather than a
hand-built format.

```tsx
// Avoid — hand-built date and time strings
<span>{date.toLocaleDateString("en-US")}</span>;
<span>{date.toLocaleTimeString("en-US")}</span>;

// Prefer — locale-aware formatting
<FormattedDate value={date} year="numeric" month="long" day="numeric" />;
<FormattedTime value={date} />;
```

## Layout

### Arranging elements: `Stack` and `Grid`, not `Box` with margins

To arrange children and the space between them, use MUI's `Stack` (one-dimensional flow with a
`spacing` prop) and `Grid` (responsive columns with `spacing` and `size`), imported from
`@mui/material`. Both apply spacing from the theme through props, so you never hand-write the
gaps. Use `Box` with manual `margin` only when neither fits.

Pure layout — arranging children and the gaps between them — is fine inline through these props
and needs no `styled()`. Anything beyond that (padding inside an element, background, borders,
and other visual styling) goes through the theme and `styled()`, as in the styling section
above.

```tsx
// Avoid — Box with hand-written margins between children
<Box>
    <Widget />
    <Box sx={{ marginTop: 16 }}>
        <Widget />
    </Box>
    <Box sx={{ marginTop: 16 }}>
        <Widget />
    </Box>
</Box>;

// Prefer — Stack with spacing from the theme
<Stack spacing={4}>
    <Widget />
    <Widget />
    <Widget />
</Stack>;
```

```tsx
// Avoid — manual flex and width math for a responsive two-column layout
<Box sx={{ display: "flex", flexWrap: "wrap" }}>
    <Box sx={{ width: "50%" }}>
        <Widget />
    </Box>
    <Box sx={{ width: "50%" }}>
        <Widget />
    </Box>
</Box>;

// Prefer — Grid with responsive size and spacing from the theme
<Grid container spacing={4}>
    <Grid size={{ xs: 12, md: 6 }}>
        <Widget />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
        <Widget />
    </Grid>
</Grid>;
```

For responsive behaviour, pass a per-breakpoint object to these props (`size` on `Grid`,
`direction` on `Stack`); inside a `styled()` component, use `theme.breakpoints` for media
queries.

Don't use `Grid` or `Stack` to lay out form fields: Comet stacks them vertically at full width,
grouped with `FieldSet` or `FormSection`.

`sx` is fine for an occasional layout property that no `Stack` or `Grid` prop covers, such as
`flexGrow`. It is not for visual styling — that goes through `styled()`.

### Page structure: `MainContent`, `Toolbar`, and their parts

Wrap a page's body in `MainContent` rather than a hand-padded `Box` — it applies the standard
page padding and can fill the height with `fullHeight`. Build the action bar from `Toolbar` and
its parts instead of assembling one from a flex row:

- `ToolbarTitleItem` holds the page title, `ToolbarActions` the action buttons; `ToolbarItem` is
  the generic slot for anything else.
- `FillSpace` is a flexbox spacer that fills the free space, moving the elements after it to the
  end.

```tsx
// Avoid — hand-built toolbar and padded container
<Box sx={{ display: "flex", padding: 16 }}>
    <Typography variant="h4">{title}</Typography>
    <Box sx={{ marginLeft: "auto" }}>
        <Button>{addLabel}</Button>
    </Box>
</Box>;

// Prefer — Toolbar parts and MainContent
<Toolbar>
    <ToolbarTitleItem>{title}</ToolbarTitleItem>
    <FillSpace />
    <ToolbarActions>
        <Button>{addLabel}</Button>
    </ToolbarActions>
</Toolbar>;
<MainContent>{children}</MainContent>;
```

When a page is rendered inside a Comet navigation `Stack` (nested master–detail views), use the
`StackMainContent` and `StackToolbar` variants instead: they render only for the active stack
level, so nested pages don't show duplicate toolbars.

### Full-height content: `fullHeight` and `FullHeightContent`

Content that should fill the viewport and scroll inside itself — most often a `DataGrid` — needs
a height-bounded parent, or it grows the whole page instead of scrolling. Set that height through
the page structure, not a hand-written `height` that has to track the header and toolbar offset:

- When the grid is the page's direct content, add `fullHeight` to `MainContent` or
  `StackMainContent`.
- When the grid is nested inside `RouterTabs` or other content rather than placed directly in
  `MainContent`, wrap it in `FullHeightContent`, which bounds the height at that level.
- When the grid holds few rows, give the `DataGrid` the `autoHeight` prop instead and skip
  `fullHeight`.

```tsx
// Avoid — a hand-set height that has to track the header and toolbar offset
<MainContent>
    <Box sx={{ height: "calc(100vh - 200px)" }}>
        <DataGrid />
    </Box>
</MainContent>;

// Prefer — fullHeight for a grid that is the page's direct content
<StackMainContent fullHeight>
    <DataGrid />
</StackMainContent>;

// Prefer — FullHeightContent for a grid nested inside tabs
<MainContent>
    <RouterTabs>
        <RouterTab path="" label={label}>
            <FullHeightContent>
                <DataGrid />
            </FullHeightContent>
        </RouterTab>
    </RouterTabs>
</MainContent>;
```
