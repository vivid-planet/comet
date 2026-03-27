## ADDED Requirements

### Requirement: HtmlText component

The library SHALL export an `HtmlText` component from its main entry point. `HtmlText` SHALL render a `<td>` HTML element with inline styles derived from the text theme. It SHALL be usable inside MJML ending tags (e.g., `MjmlRaw`) and custom HTML table layouts within an `MjmlMailRoot`.

#### Scenario: Consumer imports HtmlText

- **WHEN** a consumer writes `import { HtmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the `HtmlText` component

#### Scenario: Renders a td element

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the output is a `<td>` element containing the text "Hello"

#### Scenario: Usable inside MjmlRaw

- **WHEN** `<MjmlRaw><table><tr><HtmlText>Hello</HtmlText></tr></table></MjmlRaw>` is rendered within an `MjmlMailRoot`
- **THEN** the output contains a styled `<td>` with "Hello" inside the raw HTML table

### Requirement: HtmlTextProps type

The library SHALL export an `HtmlTextProps` type from its main entry point. `HtmlTextProps` SHALL extend `React.TdHTMLAttributes<HTMLTableCellElement>` with:

- `variant?: VariantName` — the text variant to apply from the theme
- `bottomSpacing?: boolean` — when `true`, applies the theme's `bottomSpacing` as `paddingBottom`

#### Scenario: Consumer imports HtmlTextProps

- **WHEN** a consumer writes `import type { HtmlTextProps } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Native td attributes accepted

- **WHEN** `<HtmlText colSpan={2} align="center">Hello</HtmlText>` is rendered
- **THEN** the output `<td>` has `colspan="2"` and `align="center"` attributes

#### Scenario: Variant prop is type-safe after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** writes `<HtmlText variant="heading">`
- **THEN** the assignment is type-safe

### Requirement: Theme base styles applied as inline styles

When rendered, `HtmlText` SHALL read base text styles from `theme.text` and apply them as inline CSS styles on the `<td>` element. The styles applied SHALL be: `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `lineHeight`, `letterSpacing`, `textDecoration`, `textTransform`, `color`.

For each style, the default value (via `getDefaultOrUndefined`) SHALL be extracted and set on the inline `style` object.

When `lineHeight` is present in the resolved styles, the inline styles SHALL also include `mso-line-height-rule: exactly` for consistent Outlook rendering.

#### Scenario: Default theme base styles appear in output

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered with the default theme
- **THEN** the `<td>` has inline styles including `font-family:Arial, sans-serif`, `font-size:16px`, and `line-height:20px`

#### Scenario: mso-line-height-rule added when lineHeight is present

- **WHEN** the theme has `text.lineHeight === "20px"`
- **AND** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the `<td>` inline styles include `mso-line-height-rule:exactly`

### Requirement: Variant style resolution

When the `variant` prop is specified, `HtmlText` SHALL look up the variant styles from `theme.text.variants`. The variant styles SHALL be merged over the base styles using object spread (`{ ...base, ...variantStyles }`). The default value of each merged property SHALL be extracted via `getDefaultOrUndefined` and applied as inline styles.

When `variant` is not specified but `theme.text.defaultVariant` is set, the component SHALL use the default variant.

When no variant is active, only base styles are applied.

#### Scenario: Variant overrides base styles

- **WHEN** the theme has base `fontSize: "16px"` and variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **AND** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the `<td>` inline style uses `font-size:32px`

#### Scenario: Variant inherits unoverridden base styles

- **WHEN** the theme has base `fontFamily: "Arial"` and variant `heading` with only `fontSize` defined
- **AND** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the output uses `font-family:Arial` and the heading's `fontSize`

#### Scenario: Default variant applied when no variant prop

- **WHEN** the theme has `defaultVariant: "body"` and variant `body` with `fontSize: "14px"`
- **AND** `<HtmlText>Text</HtmlText>` is rendered without a `variant` prop
- **THEN** the `body` variant styles are applied

### Requirement: Style prop merging

The user's `style` prop SHALL be merged over the theme-derived inline styles. User styles take highest priority.

#### Scenario: User style overrides theme

- **WHEN** the theme has `text.color === "black"`
- **AND** `<HtmlText style={{ color: "red" }}>Text</HtmlText>` is rendered
- **THEN** the `<td>` inline style uses `color:red`

#### Scenario: User style adds properties

- **WHEN** `<HtmlText style={{ textAlign: "center" }}>Text</HtmlText>` is rendered
- **THEN** the `<td>` inline style includes `text-align:center` alongside theme-derived styles

### Requirement: CSS class structure

`HtmlText` SHALL always apply the `htmlText` block class. When a variant is active, it SHALL additionally apply `htmlText--{variantName}`. When `bottomSpacing` is `true`, it SHALL additionally apply `htmlText--bottomSpacing`. The component SHALL merge any consumer-provided `className` via `clsx`.

#### Scenario: Base class always present

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the `<td>` has the `htmlText` CSS class

#### Scenario: Variant modifier class

- **WHEN** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the `<td>` has both `htmlText` and `htmlText--heading` CSS classes

#### Scenario: Bottom spacing modifier class

- **WHEN** `<HtmlText bottomSpacing>Text</HtmlText>` is rendered
- **THEN** the `<td>` has both `htmlText` and `htmlText--bottomSpacing` CSS classes

#### Scenario: Consumer className merged

- **WHEN** `<HtmlText className="custom">Text</HtmlText>` is rendered
- **THEN** the `<td>` has `htmlText` and `custom` CSS classes

### Requirement: bottomSpacing prop

When `bottomSpacing` is `true`, `HtmlText` SHALL apply the resolved `bottomSpacing` value (from variant or base) as `paddingBottom` in the inline styles. The value SHALL be extracted via `getDefaultOrUndefined` from the merged styles.

When `bottomSpacing` is `false` or unset, no `paddingBottom` SHALL be applied from theme.

#### Scenario: bottomSpacing applies paddingBottom

- **WHEN** the theme has `text.bottomSpacing === "16px"`
- **AND** `<HtmlText bottomSpacing>Text</HtmlText>` is rendered
- **THEN** the `<td>` inline style includes `padding-bottom:16px`

#### Scenario: bottomSpacing from variant

- **WHEN** the theme has base `bottomSpacing: "16px"` and variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **AND** `<HtmlText variant="heading" bottomSpacing>Title</HtmlText>` is rendered
- **THEN** the `<td>` inline style includes `padding-bottom:24px`

#### Scenario: bottomSpacing off by default

- **WHEN** `<HtmlText>Text</HtmlText>` is rendered without `bottomSpacing` prop
- **THEN** no theme-derived `padding-bottom` is in the inline styles

### Requirement: Responsive variant overrides via registerStyles

`HtmlText` SHALL register CSS styles via `registerStyles` that emit responsive media queries for each variant's non-default breakpoint values.

For text style properties, overrides SHALL target `.htmlText--{variantName}` with `!important` to override inline styles.

For `bottomSpacing`, overrides SHALL target `.htmlText--bottomSpacing.htmlText--{variantName}` (compound selector) with `!important`.

Responsive overrides SHALL be grouped by breakpoint — one `@media` block per breakpoint per variant.

When no variants are defined in the theme, no CSS SHALL be emitted.

#### Scenario: Responsive variant emits media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **THEN** the registered CSS contains a media query targeting the mobile breakpoint with `font-size: 24px !important` for `.htmlText--heading`

#### Scenario: Responsive bottomSpacing uses compound selector

- **WHEN** the theme defines variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **THEN** the registered CSS contains a media query with `padding-bottom: 16px !important` targeting `.htmlText--bottomSpacing.htmlText--heading`

#### Scenario: Non-responsive variant produces no media queries

- **WHEN** the theme defines variant `body` with only plain values (e.g., `fontSize: "14px"`)
- **THEN** no media queries are emitted for the `body` variant

#### Scenario: No variants produces empty CSS

- **WHEN** the theme has no `text.variants` defined
- **THEN** `registerStyles` produces no CSS output

### Requirement: TSDoc documentation

`HtmlText` and `HtmlTextProps` SHALL have TSDoc comments describing their purpose, the `variant` prop, and the `bottomSpacing` prop.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `HtmlText` in their IDE
- **THEN** they see a TSDoc comment explaining it is a themed text component for use inside MJML ending tags

### Requirement: Storybook stories

A Storybook story SHALL exist at `src/components/text/__stories__/HtmlText.stories.tsx` demonstrating `HtmlText` usage with stories covering: default styles, variants, responsive variants, bottom spacing, and usage inside `MjmlRaw`.

Stories SHALL use `@ts-expect-error` for variant keys (not module augmentation), with a comment explaining that consumers would use module augmentation of `TextVariants`.

#### Scenario: Stories render successfully

- **WHEN** a developer opens Storybook
- **THEN** all `HtmlText` stories render without errors
