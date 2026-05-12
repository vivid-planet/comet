## Context

`HtmlText` and `MjmlText` already resolve text styles (font-family, font-size, etc.) from the theme and apply them as inline styles/props. Inline links (`<a>` tags) nested inside these components need the same values applied explicitly, because Outlook Desktop's Word rendering engine overrides natural CSS inheritance on `<a>` tags with its built-in "Hyperlink" character style (blue, Times New Roman). The CSS `inherit` keyword does not work as a workaround — Word only supports CSS Level 1, which predates `inherit`.

## Goals / Non-Goals

**Goals:**

- Provide an `HtmlInlineLink` component that renders correctly in Outlook Desktop when nested inside `HtmlText` or `MjmlText`
- Make the solution transparent: existing `HtmlText`/`MjmlText` users gain the provider automatically with no API change
- Ensure `HtmlInlineLink` works outside a text component too, falling back to `inherit` for modern clients

**Non-Goals:**

- No MJML-level inline link component — `<a>` is always raw HTML, even inside MJML ending tags
- No theme-level link styling (colors, underline preferences) — this is about inheritance, not link theming
- No support for non-link inline elements (`<b>`, `<span>`, etc.) — only `<a>` tags are affected by Word's default overrides
- No public API for the Outlook text style context — the hook and type are internal; consumers override link styles via `registerStyles` or the `style` prop

## Decisions

### Single `<a>` with explicit inline styles

`HtmlInlineLink` renders a single `<a>` element with explicit inline styles for the five text properties (`fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, `color`) sourced from `OutlookTextStyleContext`. When outside a text component, it falls back to `"inherit"` for each property. The user's `style` prop is spread last, allowing overrides.

This is the simplest approach that solves the core Outlook problem. Alternatives explored (dual rendering via conditional comments, CSS-hidden duplicates) added significant complexity without proportional benefit — see "Alternatives considered" in Risks / Trade-offs.

### Responsive inherit reset at the default breakpoint

The context provides the default (desktop) values as explicit inline styles for Outlook. But when the parent text component has responsive variant overrides (e.g., `fontSize: { default: "32px", mobile: "24px" }`), the parent's media query changes the parent's font-size — while the `<a>` child still has `font-size: 32px` as an inline style that nothing overrides. The fix: register a single static media query at `theme.breakpoints.default.belowMediaQuery` that resets all five properties to `inherit !important` on `.htmlInlineLink`. This works because: (1) Outlook Desktop ignores `<style>` blocks entirely, so it only sees the explicit inline values; (2) modern clients below the breakpoint get `inherit !important` which overrides the inline style and naturally cascades from the parent — which already has the correct responsive value applied. The `default` breakpoint is used rather than `mobile` because it covers all viewports where any responsive override could be active, and `inherit` resolving to the parent's current value is always correct regardless of whether a responsive override is actually active at that width.

**Known trade-off**: The `inherit !important` media query also overrides the user's `style` prop on mobile viewports. Consumers needing a fixed style that persists on mobile can add `!important` to style values (e.g., `style={{ color: "#0066cc !important" }}`), which takes precedence over the class-level `!important` in the media query.

### Context placement: colocated with text components

The `OutlookTextStyleContext` lives in `src/components/text/OutlookTextStyleContext.tsx` rather than in a shared `contexts/` directory or alongside the inline link component. Both text components (`HtmlText`, `MjmlText`) are the providers, and the context is fundamentally about text style values — it belongs with the text concern. The inline link component is a consumer, not the owner.

### Property set: five properties

The context carries `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, and `color`. These are the properties Word overrides on `<a>` tags. Other text properties (`letterSpacing`, `textDecoration`, `textTransform`, `fontStyle`) are not affected by Word's Hyperlink character style and are excluded to keep the context lean. `textDecoration` is intentionally excluded because `HtmlInlineLink` applies its own `textDecoration: "underline"` default.

### Hook returns null, not throwing

`useOutlookTextStyle()` returns `OutlookTextStyleValues | null` rather than throwing when no provider exists. This allows `HtmlInlineLink` to degrade gracefully to `inherit` values when used outside a text component, instead of forcing a provider ancestor.

### Provider wraps children inside the rendered element

In `HtmlText`, the `OutlookTextStyleProvider` wraps `children` inside the `<td>`, not outside it. Same for `MjmlText` — the provider wraps children inside the base `MjmlText` component. This ensures the context is scoped to descendants and doesn't leak upward.

### OutlookTextStyleValues sourced from effective values (theme merge + style/props override)

The provider values are the effective text styles: the resolved theme merge (base + variant) with the user's explicit overrides merged on top. For `HtmlText`, this means the `style` prop's relevant properties override theme values; for `MjmlText`, explicit props like `color` or `fontFamily` override theme values. This ensures that when a consumer sets `style={{ color: "red" }}` on `HtmlText`, nested `HtmlInlineLink` instances inherit `red` — matching the behavior of natural CSS inheritance. "Explicit always wins" applies consistently: theme < variant < user override.

### MjmlText provider wraps children despite MJML compilation

MJML compiles the React tree to HTML, but React context is resolved during the React render phase, before MJML compilation. The `OutlookTextStyleProvider` wrapping children inside `MjmlText` works because any `HtmlInlineLink` inside the children will read the context during React rendering, receiving explicit values that are then baked into the compiled HTML output.

### CSS class for registerStyles targeting

`HtmlInlineLink` applies the `htmlInlineLink` block class following the library's BEM convention. This enables consumers to globally style all inline links via `registerStyles` with `{ inline: true }`. MJML's Juice-based CSS inliner runs post-compilation on the final HTML, so it applies to raw `<a>` elements — not just MJML components. Inlined `registerStyles` rules end up as `style` attributes on the element, making them Outlook-compatible. Because Juice appends to existing inline styles, `registerStyles({ inline: true })` rules take precedence over the component's React-rendered defaults — the same behavior other components exhibit.

### File and component placement

`HtmlInlineLink` lives at `src/components/inlineLink/HtmlInlineLink.tsx` — a separate concern directory, not under `text/`. While the context lives with text, the inline link is its own component with its own stories and export.

## Risks / Trade-offs

- **[Responsive `inherit !important` overrides consumer styles on mobile]** → The media query reset overrides the user's `style` prop below the default breakpoint. Consumers can add `!important` to style values (e.g., `style={{ color: "#0066cc !important" }}`), which takes precedence over the class-level `!important` in the media query.
- **[Slight overhead in HtmlText/MjmlText]** → Every render creates a context provider even when no `HtmlInlineLink` is nested. React context providers with stable values are essentially free, and the values are already computed — no additional work beyond the object creation.

### Alternatives considered

- **Dual rendering via conditional comments**: Renders two `<a>` elements — one inside `<!--[if mso]>...<![endif]-->` with explicit styles, one inside `<!--[if !mso]><!-->...<![endif]-->` relying on inheritance. Eliminates the responsive conflict entirely. Rejected because Juice (MJML's CSS inliner) cannot see DOM elements inside HTML conditional comments, so `registerStyles({ inline: true })` would not apply to the Outlook `<a>`. This defeats the purpose of the library's inline styling mechanism.
- **Real-DOM dual rendering with CSS hiding**: Both `<a>` elements as real DOM nodes, the Outlook version hidden from modern clients via non-inlined `display: none` CSS. Juice can see both. Rejected due to content duplication in the DOM, potential accessibility issues (screen readers), and the added complexity of coordinating CSS hiding with conditional comments.
