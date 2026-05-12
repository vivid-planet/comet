## Requirements

### Requirement: HtmlInlineLink component

The library SHALL export an `HtmlInlineLink` component from its main entry point. `HtmlInlineLink` SHALL render an `<a>` element. It SHALL accept all standard `<a>` HTML attributes via `ComponentProps<"a">`.

`HtmlInlineLink` SHALL call `useOutlookTextStyle()` and apply the returned values as explicit inline styles on the `<a>` element. When `useOutlookTextStyle()` returns `null` (no `OutlookTextStyleProvider` ancestor), it SHALL fall back to `"inherit"` for each property. The applied style properties SHALL be: `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, `color`.

`HtmlInlineLink` SHALL set `textDecoration: "underline"` as a default inline style.

`HtmlInlineLink` SHALL default `target` to `"_blank"` when not specified.

When the user passes a `style` prop, its properties SHALL take precedence over context-derived and fallback styles.

#### Scenario: Inside HtmlText with theme, link receives explicit font values

- **WHEN** `<HtmlText><HtmlInlineLink href="https://example.com">link</HtmlInlineLink></HtmlText>` is rendered within a `ThemeProvider` whose theme has `fontFamily: "Arial, sans-serif"` and `color: "#333"`
- **THEN** the `<a>` element has inline styles `font-family: Arial, sans-serif` and `color: #333` (explicit values, not `inherit`)

#### Scenario: Outside any text component, link falls back to inherit

- **WHEN** `<HtmlInlineLink href="https://example.com">link</HtmlInlineLink>` is rendered without an `OutlookTextStyleProvider` ancestor
- **THEN** the `<a>` element has inline styles with `font-family: inherit`, `font-size: inherit`, `line-height: inherit`, `font-weight: inherit`, and `color: inherit`

#### Scenario: User style prop overrides context values

- **WHEN** `<HtmlInlineLink style={{ color: "#0066cc" }}>link</HtmlInlineLink>` is rendered inside an `HtmlText`
- **THEN** the `<a>` element uses `color: #0066cc` (user override) while other properties come from context

#### Scenario: target defaults to \_blank

- **WHEN** `<HtmlInlineLink href="https://example.com">link</HtmlInlineLink>` is rendered without a `target` prop
- **THEN** the `<a>` element has `target="_blank"`

#### Scenario: target can be overridden

- **WHEN** `<HtmlInlineLink href="https://example.com" target="_self">link</HtmlInlineLink>` is rendered
- **THEN** the `<a>` element has `target="_self"`

### Requirement: CSS class structure

`HtmlInlineLink` SHALL always apply the `htmlInlineLink` block class on the rendered `<a>` element. The component SHALL merge any consumer-provided `className` via `clsx`. This enables consumers to target the component with `registerStyles` (including the `{ inline: true }` option for Outlook-compatible global link styling).

### Requirement: Responsive inherit reset via registerStyles

`HtmlInlineLink` SHALL register CSS styles via `registerStyles` that reset all five text style properties (`font-family`, `font-size`, `line-height`, `font-weight`, `color`) to `inherit !important` at the `default` breakpoint (`theme.breakpoints.default.belowMediaQuery`). This ensures that when a parent text component applies responsive variant overrides via media queries, the inline link inherits the updated values instead of being stuck at the explicit desktop values from its inline styles.

Outlook Desktop ignores `<style>` blocks entirely, so this reset is invisible to the Word engine — it continues to use the explicit inline values. Modern clients that support media queries also support `inherit`, so the link correctly inherits the parent's responsive values.

#### Scenario: Responsive variant font-size change propagates to link

- **WHEN** `HtmlInlineLink` is inside an `HtmlText` with a variant that has `fontSize: { default: "32px", mobile: "24px" }`
- **AND** the viewport is below the `default` breakpoint
- **THEN** the `<a>` element inherits the parent's responsive `font-size: 24px` instead of keeping its inline `font-size: 32px`

### Requirement: HtmlInlineLinkProps type

The library SHALL export an `HtmlInlineLinkProps` type from its main entry point. `HtmlInlineLinkProps` SHALL extend `ComponentProps<"a">`.

### Requirement: Storybook stories

A Storybook story file SHALL exist at `src/components/inlineLink/__stories__/HtmlInlineLink.stories.tsx`. Stories SHALL demonstrate:

- Basic usage inside an `MjmlText` component (with a `ThemeProvider`), demonstrating that the context works across MJML compilation
- Custom color override via the `style` prop with `!important`, demonstrating that `!important` overrides the responsive `inherit !important` reset to persist across viewports. The story SHALL have a brief JSDoc comment (1–2 sentences) explaining why `!important` is needed.
- Multiple text variants, showing a heading and body `MjmlText` each containing an `HtmlInlineLink`, demonstrating that the link automatically inherits different styles from different text variant contexts

Custom themes SHALL be passed via `parameters: { theme }`.

### Requirement: TSDoc documentation

`HtmlInlineLink` and `HtmlInlineLinkProps` SHALL have TSDoc comments. The `HtmlInlineLink` TSDoc SHALL mention its purpose (inline link styled to match surrounding text), its intended usage context (inside `HtmlText` or `MjmlText`), and the Outlook Desktop workaround it provides.
