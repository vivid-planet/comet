## ADDED Requirements

### Requirement: MjmlText component replaces re-export

The library SHALL export a custom `MjmlText` component from its main entry point, replacing the previous re-export from `@faire/mjml-react`. The custom component SHALL accept all props from `IMjmlTextProps` (the base `@faire/mjml-react` text component) and forward them to the base component.

#### Scenario: Consumer imports MjmlText

- **WHEN** a consumer writes `import { MjmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the custom themed `MjmlText` component

#### Scenario: All base props are forwarded

- **WHEN** `<MjmlText align="center" color="red" padding="10px">Hello</MjmlText>` is rendered
- **THEN** the base `MjmlText` receives `align="center"`, `color="red"`, and `padding="10px"`

#### Scenario: Explicit props override theme-derived values

- **WHEN** the theme has `text.fontFamily === "Arial"` and `<MjmlText fontFamily="Georgia">` is rendered
- **THEN** the output uses `fontFamily="Georgia"` (explicit prop wins)

### Requirement: MjmlTextProps type

The library SHALL export a `MjmlTextProps` type from its main entry point. `MjmlTextProps` SHALL extend `IMjmlTextProps` with:

- `variant?: VariantName` — the text variant to apply from the theme
- `bottomSpacing?: boolean` — when `true`, applies the theme's `bottomSpacing` as `paddingBottom`

#### Scenario: Consumer imports MjmlTextProps

- **WHEN** a consumer writes `import type { MjmlTextProps } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Variant prop is type-safe after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** writes `<MjmlText variant="heading">`
- **THEN** the assignment is type-safe

#### Scenario: Invalid variant rejected after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** writes `<MjmlText variant="typo">`
- **THEN** a TypeScript error occurs

### Requirement: Theme base styles applied as inline props

When rendered, `MjmlText` SHALL read base text styles from `theme.text` and pass them as props to the base `MjmlText` component. The base styles applied SHALL be: `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `lineHeight`, `letterSpacing`, `textDecoration`, `textTransform`, `color`.

For each base style, the default value (via `getDefaultOrUndefined`) SHALL be extracted and passed as the corresponding prop on the base component.

`fontWeight` SHALL be converted to a string via `String()` before being passed to the base component, since `IMjmlTextProps.fontWeight` only accepts `string`.

#### Scenario: Default theme base styles appear in output

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered with the default theme
- **THEN** the output HTML contains `font-family:Arial, sans-serif`, `font-size:16px`, and `line-height:20px` as inline styles

#### Scenario: Custom base styles from theme

- **WHEN** the theme has `text.fontFamily === "Georgia"` and `text.fontSize === "18px"`
- **AND** `<MjmlText>Hello</MjmlText>` is rendered
- **THEN** the output uses `font-family:Georgia` and `font-size:18px`

#### Scenario: fontWeight number is converted to string

- **WHEN** the theme has `text.fontWeight === 700`
- **AND** `<MjmlText>Hello</MjmlText>` is rendered
- **THEN** the output contains `font-weight:700` (the number was converted to string for the MJML component)

### Requirement: Variant style resolution

When the `variant` prop is specified, `MjmlText` SHALL look up the variant styles from `theme.text.variants`. The variant styles SHALL be merged over the base styles using object spread (`{ ...base, ...variantStyles }`). The default value of each merged property SHALL be extracted via `getDefaultOrUndefined` and applied as inline props.

When `variant` is not specified but `theme.text.defaultVariant` is set, the component SHALL use the default variant.

When no variant is active (no `variant` prop and no `defaultVariant`), only base styles are applied.

#### Scenario: Variant overrides base styles

- **WHEN** the theme has base `fontSize: "16px"` and variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **AND** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the inline style uses `font-size:32px` (the heading variant's default value)

#### Scenario: Variant inherits unoverridden base styles

- **WHEN** the theme has base `fontFamily: "Arial"` and variant `heading` with only `fontSize` defined
- **AND** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the output uses `font-family:Arial` (inherited from base) and the heading's `fontSize`

#### Scenario: Default variant applied when no variant prop

- **WHEN** the theme has `defaultVariant: "body"` and variant `body` with `fontSize: "14px"`
- **AND** `<MjmlText>Text</MjmlText>` is rendered without a `variant` prop
- **THEN** the `body` variant styles are applied

#### Scenario: Nonexistent variant falls back to base only

- **WHEN** the theme has no variant named `unknown`
- **AND** `<MjmlText variant="unknown">Text</MjmlText>` is rendered
- **THEN** only base styles are applied (no error thrown)

### Requirement: CSS class structure

`MjmlText` SHALL always apply the `mjmlText` block class. When a variant is active, it SHALL additionally apply `mjmlText--{variantName}`. When `bottomSpacing` is `true`, it SHALL additionally apply `mjmlText--bottomSpacing`. The component SHALL merge any consumer-provided `className` via `clsx`.

The resolved class string SHALL be passed to the base component via the `className` prop.

#### Scenario: Base class always present

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered
- **THEN** the output element has the `mjmlText` CSS class

#### Scenario: Variant modifier class

- **WHEN** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the output element has both `mjmlText` and `mjmlText--heading` CSS classes

#### Scenario: Bottom spacing modifier class

- **WHEN** `<MjmlText bottomSpacing>Text</MjmlText>` is rendered
- **THEN** the output element has both `mjmlText` and `mjmlText--bottomSpacing` CSS classes

#### Scenario: Consumer className merged

- **WHEN** `<MjmlText className="custom">Text</MjmlText>` is rendered
- **THEN** the output element has `mjmlText` and `custom` CSS classes

### Requirement: bottomSpacing prop

When `bottomSpacing` is `true`, `MjmlText` SHALL apply the resolved `bottomSpacing` value (from variant or base) as `paddingBottom` on the base component. The value SHALL be extracted via `getDefaultOrUndefined` from the merged styles.

When `bottomSpacing` is `false` or unset, no `paddingBottom` SHALL be applied from theme.

#### Scenario: bottomSpacing applies paddingBottom

- **WHEN** the theme has `text.bottomSpacing === 16`
- **AND** `<MjmlText bottomSpacing>Text</MjmlText>` is rendered
- **THEN** the output has `padding-bottom:16px` as an inline style

#### Scenario: bottomSpacing from variant

- **WHEN** the theme has base `bottomSpacing: 16` and variant `heading` with `bottomSpacing: { default: 24, mobile: 16 }`
- **AND** `<MjmlText variant="heading" bottomSpacing>Title</MjmlText>` is rendered
- **THEN** the output has `padding-bottom:24px` (heading variant's default value)

#### Scenario: bottomSpacing off by default

- **WHEN** `<MjmlText>Text</MjmlText>` is rendered without `bottomSpacing` prop
- **THEN** no theme-derived `paddingBottom` is applied

### Requirement: Responsive variant overrides via registerStyles

`MjmlText` SHALL register CSS styles via `registerStyles` that emit responsive media queries for each variant's non-default breakpoint values.

For text style properties, overrides SHALL target `.mjmlText--{variantName} > div` with `!important` to override inline styles.

For `bottomSpacing`, overrides SHALL target `.mjmlText--bottomSpacing.mjmlText--{variantName}` (compound selector) with `!important`.

Responsive overrides SHALL be grouped by breakpoint — one `@media` block per breakpoint per variant, containing all property declarations for that breakpoint.

When no variants are defined in the theme, no CSS SHALL be emitted.

#### Scenario: Responsive variant emits media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **THEN** the registered CSS contains a media query targeting the mobile breakpoint with `font-size: 24px !important` for `.mjmlText--heading > div`

#### Scenario: Multiple properties grouped in one media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }` and `lineHeight: { default: "40px", mobile: "30px" }`
- **THEN** the registered CSS contains a single mobile media query block for `.mjmlText--heading > div` with both `font-size` and `line-height` declarations

#### Scenario: Responsive bottomSpacing uses compound selector

- **WHEN** the theme defines variant `heading` with `bottomSpacing: { default: 24, mobile: 16 }`
- **THEN** the registered CSS contains a media query with `padding-bottom: 16px !important` targeting `.mjmlText--bottomSpacing.mjmlText--heading`

#### Scenario: Non-responsive variant produces no media queries

- **WHEN** the theme defines variant `body` with only plain values (e.g., `fontSize: "14px"`)
- **THEN** no media queries are emitted for the `body` variant

#### Scenario: No variants produces empty CSS

- **WHEN** the theme has no `text.variants` defined
- **THEN** `registerStyles` produces no CSS output

### Requirement: TSDoc documentation

`MjmlText` and `MjmlTextProps` SHALL have TSDoc comments describing their purpose, the `variant` prop, and the `bottomSpacing` prop.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `MjmlText` in their IDE
- **THEN** they see a TSDoc comment explaining it is a themed text component with variant support

### Requirement: Storybook stories

A Storybook story SHALL exist at `src/components/text/__stories__/MjmlText.stories.tsx` demonstrating `MjmlText` usage with the following stories:

- Default: base styles from the default theme
- With Variants: defines heading/body/caption variants via `createTheme`
- Responsive Variants: variants with responsive values
- Bottom Spacing: with and without `bottomSpacing` prop
- Default Variant: sets `defaultVariant` in theme

Stories SHALL use `@ts-expect-error` for variant keys in theme definitions and `variant` props (not module augmentation), with a comment explaining that consumers would use module augmentation of `TextVariants`.

Custom themes SHALL be passed via `parameters: { theme }` (existing decorator support).

#### Scenario: Stories render successfully

- **WHEN** a developer opens Storybook
- **THEN** all `MjmlText` stories render without errors

#### Scenario: Stories use ts-expect-error

- **WHEN** a developer reads the story source
- **THEN** variant usage is annotated with `@ts-expect-error` and an explanatory comment
