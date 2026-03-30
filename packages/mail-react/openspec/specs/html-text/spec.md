## Requirements

### Requirement: HtmlText component

The library SHALL export an `HtmlText` component from its main entry point. `HtmlText` SHALL render a `<td>` element by default, or the element specified by the `component` prop, with inline styles derived from the text theme. It SHALL accept HTML attributes appropriate for the rendered element.

`HtmlText` SHALL require a `ThemeProvider` ancestor and SHALL use `useTheme()` to access the theme.

#### Scenario: Consumer imports HtmlText

- **WHEN** a consumer writes `import { HtmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the `HtmlText` component

#### Scenario: Renders a td element by default

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered within a `ThemeProvider`
- **THEN** the output is a `<td>` element containing "Hello"

#### Scenario: Standard td attributes forwarded

- **WHEN** `<HtmlText colSpan={2} align="center">Hello</HtmlText>` is rendered
- **THEN** the rendered `<td>` has `colspan="2"` and `align="center"`

#### Scenario: Throws without ThemeProvider

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered without a `ThemeProvider` ancestor
- **THEN** the component throws an error indicating that a `ThemeProvider` is required

### Requirement: HtmlTextProps type

The library SHALL export an `HtmlTextProps` type from its main entry point. `HtmlTextProps` SHALL be a generic type `HtmlTextProps<C extends keyof JSX.IntrinsicElements = "td">` that includes:

- `component?: C` — the HTML element to render (defaults to `"td"`)
- `variant?: VariantName` — the text variant to apply from the theme
- `bottomSpacing?: boolean` — when `true`, applies the theme's `bottomSpacing` as `padding-bottom`
- HTML attributes appropriate for element `C` (via `ComponentPropsWithoutRef<C>`, minus own props)

When used without a type argument, `HtmlTextProps` SHALL default to `<td>` attributes, maintaining backwards compatibility.

#### Scenario: Consumer imports HtmlTextProps

- **WHEN** a consumer writes `import type { HtmlTextProps } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Variant prop is type-safe after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** writes `<HtmlText variant="heading">`
- **THEN** the assignment is type-safe

#### Scenario: HtmlTextProps without type argument defaults to td

- **WHEN** a consumer writes `const props: HtmlTextProps = { colSpan: 2 }`
- **THEN** the code compiles (`colSpan` is valid for `<td>`)

#### Scenario: HtmlTextProps with explicit type argument

- **WHEN** a consumer writes `const props: HtmlTextProps<"a"> = { component: "a", href: "/foo" }`
- **THEN** the code compiles (`href` is valid for `<a>`)

### Requirement: Theme base styles applied as inline styles

When rendered within a `ThemeProvider`, `HtmlText` SHALL read base text styles from `theme.text` and apply them as inline CSS properties on the `<td>` element via the `style` attribute. The styles applied SHALL be: `font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `letter-spacing`, `text-decoration`, `text-transform`, `color`.

For each style, the default value SHALL be extracted via `getDefaultOrUndefined` from the merged (base + variant) styles.

When `line-height` is present, the component SHALL also set `mso-line-height-rule: exactly` in the inline styles for consistent Outlook rendering.

#### Scenario: Default theme base styles appear as inline styles

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered within a `ThemeProvider` with the default theme
- **THEN** the `<td>` has inline styles including `font-family: Arial, sans-serif`, `font-size: 16px`, and `line-height: 20px`

#### Scenario: Outlook line-height rule added

- **WHEN** the theme has a `lineHeight` value
- **AND** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the `<td>` inline styles include `mso-line-height-rule: exactly`

#### Scenario: No line-height means no mso rule

- **WHEN** the theme has no `lineHeight` value
- **AND** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the `<td>` inline styles do NOT include `mso-line-height-rule`

### Requirement: User style prop overrides theme styles

The user's `style` prop SHALL be spread after the theme-derived inline styles, so explicit style overrides always win.

#### Scenario: Explicit style overrides theme

- **WHEN** the theme has `text.fontFamily === "Arial, sans-serif"`
- **AND** `<HtmlText style={{ fontFamily: "Georgia" }}>Hello</HtmlText>` is rendered
- **THEN** the `<td>` uses `font-family: Georgia` (explicit style wins)

#### Scenario: Style prop adds non-theme properties

- **WHEN** `<HtmlText style={{ backgroundColor: "red" }}>Hello</HtmlText>` is rendered
- **THEN** the `<td>` has both the theme-derived text styles and `background-color: red`

### Requirement: Variant style resolution

When the `variant` prop is specified, `HtmlText` SHALL look up the variant styles from `theme.text.variants`. The variant styles SHALL be merged over the base styles using object spread (`{ ...base, ...variantStyles }`). The default value of each merged property SHALL be extracted and applied as inline styles.

When `variant` is not specified but `theme.text.defaultVariant` is set, the component SHALL use the default variant.

When no variant is active (no `variant` prop and no `defaultVariant`), only base styles are applied.

#### Scenario: Variant overrides base styles

- **WHEN** the theme has base `fontSize: "16px"` and variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **AND** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the `<td>` inline style uses `font-size: 32px` (the heading variant's default value)

#### Scenario: Variant inherits unoverridden base styles

- **WHEN** the theme has base `fontFamily: "Arial"` and variant `heading` with only `fontSize` defined
- **AND** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the `<td>` uses `font-family: Arial` (inherited from base) and the heading's `fontSize`

#### Scenario: Default variant applied when no variant prop

- **WHEN** the theme has `defaultVariant: "body"` and variant `body` with `fontSize: "14px"`
- **AND** `<HtmlText>Text</HtmlText>` is rendered without a `variant` prop
- **THEN** the `body` variant styles are applied

### Requirement: CSS class structure

`HtmlText` SHALL always apply the `htmlText` block class. When a variant is active, it SHALL additionally apply `htmlText--{variantName}`. When `bottomSpacing` is `true`, it SHALL additionally apply `htmlText--bottomSpacing`. The component SHALL merge any consumer-provided `className` via `clsx`.

The CSS classes SHALL be applied identically regardless of the rendered element.

#### Scenario: Base class always present

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the rendered element has the `htmlText` CSS class

#### Scenario: Base class present with component prop

- **WHEN** `<HtmlText component="div">Hello</HtmlText>` is rendered
- **THEN** the rendered `<div>` has the `htmlText` CSS class

#### Scenario: Variant modifier class

- **WHEN** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the rendered element has both `htmlText` and `htmlText--heading` CSS classes

#### Scenario: Bottom spacing modifier class

- **WHEN** `<HtmlText bottomSpacing>Text</HtmlText>` is rendered
- **THEN** the rendered element has both `htmlText` and `htmlText--bottomSpacing` CSS classes

#### Scenario: Consumer className merged

- **WHEN** `<HtmlText className="custom">Text</HtmlText>` is rendered
- **THEN** the rendered element has `htmlText` and `custom` CSS classes

### Requirement: bottomSpacing prop

When `bottomSpacing` is `true`, `HtmlText` SHALL apply the resolved `bottomSpacing` value (from variant or base) as `padding-bottom` in the inline styles. The value SHALL be extracted via `getDefaultOrUndefined` from the merged styles.

When `bottomSpacing` is `false` or unset, no `padding-bottom` SHALL be applied from theme.

#### Scenario: bottomSpacing applies padding-bottom

- **WHEN** the theme has `text.bottomSpacing === "16px"`
- **AND** `<HtmlText bottomSpacing>Text</HtmlText>` is rendered
- **THEN** the `<td>` has `padding-bottom: 16px` in its inline styles

#### Scenario: bottomSpacing from variant

- **WHEN** the theme has base `bottomSpacing: "16px"` and variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **AND** `<HtmlText variant="heading" bottomSpacing>Title</HtmlText>` is rendered
- **THEN** the `<td>` has `padding-bottom: 24px` (heading variant's default value)

#### Scenario: bottomSpacing off by default

- **WHEN** `<HtmlText>Text</HtmlText>` is rendered without `bottomSpacing` prop
- **THEN** no theme-derived `padding-bottom` is applied

### Requirement: Responsive variant overrides via registerStyles

`HtmlText` SHALL register CSS styles via `registerStyles` that emit responsive media queries for each variant's non-default breakpoint values.

For text style properties, overrides SHALL target `.htmlText--{variantName}` with `!important` to override inline styles.

For `bottomSpacing`, overrides SHALL target `.htmlText--bottomSpacing.htmlText--{variantName}` (compound selector) with `!important`.

Responsive overrides SHALL be grouped by breakpoint — one `@media` block per breakpoint per variant, containing all property declarations for that breakpoint.

The CSS generation logic SHALL be shared with `MjmlText` via a parameterized utility function, with each component providing its own selectors.

#### Scenario: Responsive variant emits media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **THEN** the registered CSS contains a media query targeting the mobile breakpoint with `font-size: 24px !important` for `.htmlText--heading`

#### Scenario: Multiple properties grouped in one media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }` and `lineHeight: { default: "40px", mobile: "30px" }`
- **THEN** the registered CSS contains a single mobile media query block for `.htmlText--heading` with both `font-size` and `line-height` declarations

#### Scenario: Responsive bottomSpacing uses compound selector

- **WHEN** the theme defines variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **THEN** the registered CSS contains a media query with `padding-bottom: 16px !important` targeting `.htmlText--bottomSpacing.htmlText--heading`

#### Scenario: No variants produces empty CSS

- **WHEN** the theme has no `text.variants` defined
- **THEN** `registerStyles` produces no CSS output

### Requirement: component prop

`HtmlText` SHALL accept an optional `component` prop of type `keyof JSX.IntrinsicElements`. When provided, `HtmlText` SHALL render the specified HTML element instead of `<td>`. When omitted, `HtmlText` SHALL render `<td>` (preserving current default behavior).

All theme-derived inline styles, CSS classes, and own props (`variant`, `bottomSpacing`) SHALL behave identically regardless of the rendered element.

#### Scenario: Renders a div when component is "div"

- **WHEN** `<HtmlText component="div">Hello</HtmlText>` is rendered
- **THEN** the output is a `<div>` element (not a `<td>`) containing "Hello" with theme inline styles

#### Scenario: Renders an anchor with href when component is "a"

- **WHEN** `<HtmlText component="a" href="/link">Click</HtmlText>` is rendered
- **THEN** the output is an `<a>` element with `href="/link"` and theme inline styles

#### Scenario: Default behavior unchanged without component prop

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered without a `component` prop
- **THEN** the output is a `<td>` element (same as before this change)

### Requirement: Element-specific type safety via function overloads

`HtmlText` SHALL use TypeScript function overloads to provide element-specific props based on the `component` value:

1. When `component` is provided with value `C`, the available props SHALL be `ComponentPropsWithoutRef<C>` (minus `HtmlText`'s own props).
2. When `component` is omitted, the available props SHALL be `TdHTMLAttributes<HTMLTableCellElement>` (minus `HtmlText`'s own props).

The implementation SHALL NOT use `as` type assertions.

#### Scenario: href accepted when component is "a"

- **WHEN** a consumer writes `<HtmlText component="a" href="/foo">link</HtmlText>`
- **THEN** the code compiles without type errors

#### Scenario: href rejected when component is omitted

- **WHEN** a consumer writes `<HtmlText href="/foo">text</HtmlText>` (no `component` prop)
- **THEN** TypeScript reports a type error (`href` does not exist on `<td>`)

#### Scenario: colSpan rejected when component is "a"

- **WHEN** a consumer writes `<HtmlText component="a" colSpan={2}>text</HtmlText>`
- **THEN** TypeScript reports a type error (`colSpan` does not exist on `<a>`)

#### Scenario: Own props always accepted

- **WHEN** a consumer writes `<HtmlText component="div" variant="heading" bottomSpacing>text</HtmlText>`
- **THEN** the code compiles without type errors (`variant` and `bottomSpacing` are available regardless of `component`)

### Requirement: Type-level tests

The test file SHALL include type-level tests using `@ts-expect-error` comments that verify invalid prop combinations are rejected by TypeScript. These tests SHALL cover at minimum: `href` without `component="a"`, element-specific props with a mismatched `component`, and own props accepted with any `component` value.

### Requirement: Storybook stories for component prop

The HtmlText stories file SHALL include stories demonstrating the `component` prop, showing `HtmlText` rendered as different HTML elements (e.g., `<div>`, `<a>` with `href`).

### Requirement: TSDoc documentation

`HtmlText` and `HtmlTextProps` SHALL have TSDoc comments describing their purpose, the `variant` prop, and the `bottomSpacing` prop.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `HtmlText` in their IDE
- **THEN** they see a TSDoc comment explaining it is a themed text component for use inside MJML ending tags

### Requirement: Storybook stories

A Storybook story SHALL exist at `src/components/text/__stories__/HtmlText.stories.tsx` demonstrating `HtmlText` usage with the following stories:

- Default: base styles from the default theme
- With Variants: defines heading/body/caption variants via `createTheme`
- Responsive Variants: variants with responsive values
- Bottom Spacing: with and without `bottomSpacing` prop
- Default Variant: sets `defaultVariant` in theme

Stories SHALL use `@ts-expect-error` for variant keys in theme definitions and `variant` props (not module augmentation), with a comment explaining that consumers would use module augmentation of `TextVariants`.

Custom themes SHALL be passed via `parameters: { theme }` (existing decorator support).

#### Scenario: Stories render successfully

- **WHEN** a developer opens Storybook
- **THEN** all `HtmlText` stories render without errors
