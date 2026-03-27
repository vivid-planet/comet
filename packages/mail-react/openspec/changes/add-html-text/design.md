## Context

`MjmlText` wraps `@faire/mjml-react`'s `<MjmlText>`, which renders as `<mj-text>` in the MJML tree. MJML then converts this to `<td><div>...</div></td>` with inline styles. Inside MJML ending tags (e.g., `<mj-raw>`, `<mj-table>`), MJML components cannot be used — only raw HTML. There is currently no way to render themed text in these contexts.

The text theme system (variants, responsive values, `bottomSpacing`) is well-established and should be reused as-is.

## Goals / Non-Goals

**Goals:**

- Provide an `HtmlText` component that renders themed text as a `<td>` element for use inside MJML ending tags
- Reuse the existing text theme configuration (variants, responsive values, `bottomSpacing`)
- Follow the default-first styling model: inline styles for base rendering, CSS media queries as progressive enhancement

**Non-Goals:**

- Replacing `MjmlText` — both components coexist for different contexts
- Supporting usage outside of `MjmlMailRoot` (theme provider is assumed)
- Adding MJML-specific props (align, padding) — this is an HTML-native component; use `style` for layout control

## Decisions

### Render a single `<td>` element with no wrapper

`HtmlText` renders a `<td>` directly with inline styles and children inside it — no nested `<div>` or `<p>`.

**Why:** Styling `<td>` directly is the industry-standard approach for email text. All major clients (Gmail, Apple Mail, Outlook, Yahoo) support text properties on `<td>`. A `<p>` would add default margins that vary by client. A wrapper `<div>` adds unnecessary nesting.

**Caveat:** `line-height` on `<td>` requires `mso-line-height-rule: exactly` for consistent Outlook rendering. The component adds this automatically when `lineHeight` is present.

### Separate `htmlText--*` CSS classes (not reusing `mjmlText--*`)

`HtmlText` uses its own class prefix (`htmlText`, `htmlText--{variant}`, `htmlText--bottomSpacing`) and registers its own responsive CSS via a shared utility.

**Why:** `MjmlText`'s responsive selectors target `.mjmlText--{variant} > div` — a child combinator that assumes MJML's rendered `<td><div>` structure. `HtmlText` has no child `<div>`, so it needs selectors targeting the element directly: `.htmlText--{variant}`. The CSS generation logic is nearly identical but produces different selectors.

**Alternative considered:** Reusing `mjmlText--*` classes with a nested `<div>` to match the selector. Rejected because it couples `HtmlText` to `MjmlText`'s internal DOM structure and adds unnecessary nesting.

### Extract shared text utilities to `src/components/text/textStyles.ts`

The responsive CSS generation logic and the theme-key-to-CSS-property mapping are shared between `MjmlText` and `HtmlText`. These are extracted into a shared utility file rather than duplicated.

**Extracted:**
- `textStyleCssProperties` — the `ReadonlyArray<[StylePropertyKey, string]>` mapping from theme keys to CSS property names. Single source of truth used by both components.
- `generateResponsiveTextCss(theme, options)` — the responsive media query generation loop, parameterized by selector callbacks (`styleSelector` and `spacingSelector`). Each component passes its own selectors (e.g., `.mjmlText--{variant} > div` vs `.htmlText--{variant}`).

**Not extracted:**
- Style resolution (theme destructuring, variant merging) — only ~5 lines per component, reads clearly inline, and each component applies the resolved styles differently (MJML props vs inline `style` object).

**Why:** The CSS generation is ~60 lines of non-trivial logic that must stay in sync between components. Extracting it avoids behavioral drift and reduces the maintenance surface. The property mapping is a single source of truth that both components and the CSS generator depend on.

### Inline styles built as a `CSSProperties` object

Unlike `MjmlText` (which passes styles as individual MJML props), `HtmlText` builds a `React.CSSProperties` object from the resolved theme values and passes it as the `style` prop.

**Merge order (lowest → highest priority):**
1. Theme base styles
2. Variant styles (default values extracted from responsive values)
3. User's `style` prop

**Why:** There is no MJML layer to convert named props to inline styles — the component must do it directly. Spreading the user's `style` last ensures direct overrides always win.

### Accept standard `<td>` HTML attributes

`HtmlTextProps` extends `React.TdHTMLAttributes<HTMLTableCellElement>` and adds `variant` and `bottomSpacing`. This gives consumers full access to native attributes (`colSpan`, `rowSpan`, `align`, etc.) without mapping MJML-specific props.

**Why:** The component renders a `<td>`. Consumers should use the element's native API.

## Risks / Trade-offs

**Duplicate responsive CSS** — Both `MjmlText` and `HtmlText` register responsive media queries for the same variants. In practice, this is negligible (a few hundred bytes in the `<style>` block) and keeps the components fully decoupled. → Accepted trade-off.

**Outlook `padding-bottom` row normalization** — Outlook Windows normalizes vertical padding across all `<td>`s in a `<tr>` to the largest value. This is a known Outlook limitation, not specific to this component. When `HtmlText` is the only cell in its `<tr>` (the expected usage), `padding-bottom` works correctly. → No mitigation needed; inherent email client behavior.

**`font-weight` granularity in Outlook** — Outlook Windows only distinguishes `normal` (0–599) and `bold` (600–1000). No mitigation; this is a client-side limitation that also affects `MjmlText`. → Accepted.
