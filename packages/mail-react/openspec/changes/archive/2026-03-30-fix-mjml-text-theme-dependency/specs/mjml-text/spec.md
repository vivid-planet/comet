## MODIFIED Requirements

### Requirement: MjmlText component replaces re-export

The library SHALL export a custom `MjmlText` component from its main entry point, replacing the previous re-export from `@faire/mjml-react`. The custom component SHALL accept all props from `IMjmlTextProps` (the base `@faire/mjml-react` text component) and forward them to the base component.

The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features (`variant`, `bottomSpacing`) are not used. When no theme is present and no theme-dependent props are specified, the component SHALL render as a transparent pass-through to the base `MjmlText`, applying no theme-derived inline styles.

#### Scenario: Consumer imports MjmlText

- **WHEN** a consumer writes `import { MjmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the custom themed `MjmlText` component

#### Scenario: All base props are forwarded

- **WHEN** `<MjmlText align="center" color="red" padding="10px">Hello</MjmlText>` is rendered
- **THEN** the base `MjmlText` receives `align="center"`, `color="red"`, and `padding="10px"`

#### Scenario: Explicit props override theme-derived values

- **WHEN** the theme has `text.fontFamily === "Arial"` and `<MjmlText fontFamily="Georgia">` is rendered
- **THEN** the output uses `fontFamily="Georgia"` (explicit prop wins)

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlText` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor and without `variant` or `bottomSpacing` props
- **THEN** the component renders successfully without throwing an error

#### Scenario: Without theme, no theme-derived styles are applied

- **WHEN** `MjmlText` is rendered without a `ThemeProvider` and without theme-dependent props
- **THEN** no theme-derived inline styles (fontFamily, fontSize, etc.) are applied — only explicitly passed props reach the base component

#### Scenario: Without theme, block class and consumer className still applied

- **WHEN** `<MjmlText className="custom">Hello</MjmlText>` is rendered without a `ThemeProvider`
- **THEN** the output element has both `mjmlText` and `custom` CSS classes

### Requirement: Theme base styles applied as inline props

When rendered within a `ThemeProvider`, `MjmlText` SHALL read base text styles from `theme.text` and pass them as props to the base `MjmlText` component. The base styles applied SHALL be: `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `lineHeight`, `letterSpacing`, `textDecoration`, `textTransform`, `color`.

For each base style, the default value (via `getDefaultOrUndefined`) SHALL be extracted and passed as the corresponding prop on the base component.

`fontWeight` SHALL be converted to a string via `String()` before being passed to the base component, since `IMjmlTextProps.fontWeight` only accepts `string`.

When no `ThemeProvider` is present, no base styles SHALL be applied.

#### Scenario: Default theme base styles appear in output

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered within a `ThemeProvider` with the default theme
- **THEN** the output HTML contains `font-family:Arial, sans-serif`, `font-size:16px`, and `line-height:20px` as inline styles

#### Scenario: Custom base styles from theme

- **WHEN** the theme has `text.fontFamily === "Georgia"` and `text.fontSize === "18px"`
- **AND** `<MjmlText>Hello</MjmlText>` is rendered within a `ThemeProvider`
- **THEN** the output uses `font-family:Georgia` and `font-size:18px`

#### Scenario: fontWeight number is converted to string

- **WHEN** the theme has `text.fontWeight === 700`
- **AND** `<MjmlText>Hello</MjmlText>` is rendered within a `ThemeProvider`
- **THEN** the output contains `font-weight:700` (the number was converted to string for the MJML component)

#### Scenario: No base styles without ThemeProvider

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered without a `ThemeProvider`
- **THEN** no theme-derived font-family, font-size, line-height, or other base styles are applied as inline props

### Requirement: Variant style resolution

When the `variant` prop is specified, `MjmlText` SHALL look up the variant styles from `theme.text.variants`. The variant styles SHALL be merged over the base styles using object spread (`{ ...base, ...variantStyles }`). The default value of each merged property SHALL be extracted via `getDefaultOrUndefined` and applied as inline props.

When `variant` is not specified but `theme.text.defaultVariant` is set, the component SHALL use the default variant.

When no variant is active (no `variant` prop and no `defaultVariant`), only base styles are applied.

When `variant` is specified and no `ThemeProvider` is present, the component SHALL throw an error with a message indicating that the `variant` prop requires a `ThemeProvider` or `MjmlMailRoot`.

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

#### Scenario: Variant without ThemeProvider throws targeted error

- **WHEN** `<MjmlText variant="heading">Title</MjmlText>` is rendered without a `ThemeProvider`
- **THEN** the component throws an error with a message indicating that the `variant` prop requires a `ThemeProvider` or `MjmlMailRoot`

### Requirement: bottomSpacing prop

When `bottomSpacing` is `true`, `MjmlText` SHALL apply the resolved `bottomSpacing` value (from variant or base) as `paddingBottom` on the base component. The value SHALL be extracted via `getDefaultOrUndefined` from the merged styles.

When `bottomSpacing` is `false` or unset, no `paddingBottom` SHALL be applied from theme.

When `bottomSpacing` is `true` and no `ThemeProvider` is present, the component SHALL throw an error with a message indicating that the `bottomSpacing` prop requires a `ThemeProvider` or `MjmlMailRoot`.

#### Scenario: bottomSpacing applies paddingBottom

- **WHEN** the theme has `text.bottomSpacing === "16px"`
- **AND** `<MjmlText bottomSpacing>Text</MjmlText>` is rendered
- **THEN** the output has `padding-bottom:16px` as an inline style

#### Scenario: bottomSpacing from variant

- **WHEN** the theme has base `bottomSpacing: "16px"` and variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **AND** `<MjmlText variant="heading" bottomSpacing>Title</MjmlText>` is rendered
- **THEN** the output has `padding-bottom:24px` (heading variant's default value)

#### Scenario: bottomSpacing off by default

- **WHEN** `<MjmlText>Text</MjmlText>` is rendered without `bottomSpacing` prop
- **THEN** no theme-derived `paddingBottom` is applied

#### Scenario: bottomSpacing without ThemeProvider throws targeted error

- **WHEN** `<MjmlText bottomSpacing>Text</MjmlText>` is rendered without a `ThemeProvider`
- **THEN** the component throws an error with a message indicating that the `bottomSpacing` prop requires a `ThemeProvider` or `MjmlMailRoot`
