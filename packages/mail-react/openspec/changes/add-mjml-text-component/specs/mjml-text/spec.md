## ADDED Requirements

### Requirement: MjmlText component with theme integration

The library SHALL export a custom `MjmlText` component from its main entry point that wraps `@faire/mjml-react`'s `MjmlText`. The custom component SHALL accept all props from the base `MjmlText` component.

The component SHALL read text styles from the theme via `useTheme()`. It SHALL resolve the active variant by using the `variant` prop if provided, otherwise falling back to `theme.text.defaultVariant`. If neither is defined, no variant is active.

When a variant is active and defined in `theme.text.variants`, the component SHALL merge base and variant styles by spreading the variant styles over the base styles (variant wins per key). When no variant is active, only base styles apply.

For each style key in the resolved styles, the component SHALL call `getDefaultValue()` and pass the result as the corresponding prop to the underlying `MjmlText` component (e.g., `fontSize`, `fontFamily`, `color`). For `bottomSpacing`, the default value SHALL be applied as `paddingBottom` only when the `bottomSpacing` prop is `true`.

Explicitly passed props (e.g., `fontSize`, `color`, `paddingBottom`) SHALL override theme-resolved values. This includes `paddingBottom` overriding the value derived from theme `bottomSpacing` when the `bottomSpacing` prop is `true`.

#### Scenario: No theme text config

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered and the theme has no `text` configuration
- **THEN** the component renders as the base `MjmlText` with no additional styling

#### Scenario: Base theme styles applied

- **WHEN** the theme defines `text: { fontSize: "16px", color: "#333" }` and `<MjmlText>Hello</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `fontSize="16px"` and `color="#333"` as props

#### Scenario: Variant overrides base styles

- **WHEN** the theme defines `text: { fontSize: "16px", variants: { heading: { fontSize: "24px", fontWeight: "700" } } }`
- **AND** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `fontSize="24px"` and `fontWeight="700"`

#### Scenario: Default variant applied when no variant prop

- **WHEN** the theme defines `text: { defaultVariant: "body", variants: { body: { lineHeight: "1.6" } } }`
- **AND** `<MjmlText>Content</MjmlText>` is rendered without a `variant` prop
- **THEN** the `body` variant is applied and `lineHeight="1.6"` is passed

#### Scenario: Explicit prop overrides theme value

- **WHEN** the theme defines `text: { fontSize: "16px" }`
- **AND** `<MjmlText fontSize="20px">Custom</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `fontSize="20px"`

#### Scenario: Variant prop overrides defaultVariant

- **WHEN** the theme defines `text: { defaultVariant: "body", variants: { body: { fontSize: "16px" }, heading: { fontSize: "24px" } } }`
- **AND** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the `heading` variant is used, not `body`

### Requirement: MjmlText variant prop

`MjmlText` SHALL accept an optional `variant` prop typed as `keyof TextVariants`. When `TextVariants` has not been augmented, the prop type resolves to `never` (unusable until variants are defined).

#### Scenario: Variant prop with augmented TextVariants

- **WHEN** `TextVariants` is augmented with `heading`
- **AND** `<MjmlText variant="heading">` is rendered
- **THEN** the component renders without TypeScript errors

#### Scenario: Invalid variant name rejected

- **WHEN** `TextVariants` is augmented with `heading` and `body`
- **AND** a consumer writes `<MjmlText variant="unknown">`
- **THEN** a TypeScript error occurs

### Requirement: MjmlText bottomSpacing prop

`MjmlText` SHALL accept an optional `bottomSpacing` prop of type `boolean`. When `true`, the component SHALL apply the resolved `bottomSpacing` value from the theme (base merged with variant) as `paddingBottom` on the underlying `MjmlText`, in pixels. When `false` or omitted, no bottom spacing is applied.

If the resolved styles contain no `bottomSpacing` value, the prop SHALL have no effect.

#### Scenario: bottomSpacing applied from theme

- **WHEN** the theme defines `text: { bottomSpacing: 16 }`
- **AND** `<MjmlText bottomSpacing>Content</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `paddingBottom={16}`

#### Scenario: bottomSpacing from variant

- **WHEN** the theme defines `text: { bottomSpacing: 16, variants: { heading: { bottomSpacing: 24 } } }`
- **AND** `<MjmlText variant="heading" bottomSpacing>Title</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `paddingBottom` with `getDefaultValue(24)` which is `24`

#### Scenario: bottomSpacing false by default

- **WHEN** the theme defines `text: { bottomSpacing: 16 }`
- **AND** `<MjmlText>Content</MjmlText>` is rendered without `bottomSpacing`
- **THEN** no `paddingBottom` is applied from the theme

#### Scenario: Explicit paddingBottom overrides theme bottomSpacing

- **WHEN** the theme defines `text: { bottomSpacing: 16 }`
- **AND** `<MjmlText bottomSpacing paddingBottom={8}>Content</MjmlText>` is rendered
- **THEN** the underlying `MjmlText` receives `paddingBottom={8}`, not `16`

#### Scenario: bottomSpacing with no theme value

- **WHEN** the theme defines `text: {}` (no `bottomSpacing`)
- **AND** `<MjmlText bottomSpacing>Content</MjmlText>` is rendered
- **THEN** no `paddingBottom` is applied

### Requirement: MjmlText CSS class structure

`MjmlText` SHALL apply CSS classes following BEM conventions with `mjmlText` as the block name:

- `mjmlText` SHALL always be applied as the base class
- `mjmlText--{variantName}` SHALL be applied when a variant is active (e.g., `mjmlText--heading`)
- `mjmlText--bottomSpacing` SHALL be applied when the `bottomSpacing` prop is `true`
- Consumer-provided `className` SHALL be merged via `clsx`

The classes SHALL be passed to the underlying `MjmlText` via the `cssClass` prop.

#### Scenario: Base class always present

- **WHEN** `<MjmlText>Hello</MjmlText>` is rendered
- **THEN** the element has class `mjmlText`

#### Scenario: Variant class applied

- **WHEN** `<MjmlText variant="heading">Title</MjmlText>` is rendered
- **THEN** the element has classes `mjmlText mjmlText--heading`

#### Scenario: Bottom spacing class applied

- **WHEN** `<MjmlText bottomSpacing>Content</MjmlText>` is rendered
- **THEN** the element has classes `mjmlText mjmlText--bottomSpacing`

#### Scenario: Consumer className merged

- **WHEN** `<MjmlText className="custom">Hello</MjmlText>` is rendered
- **THEN** the element has classes `mjmlText custom`

### Requirement: MjmlText responsive variant styles via registerStyles

`MjmlText` SHALL register a theme-aware `registerStyles` function that emits responsive CSS for variant styles. For each variant defined in `theme.text.variants`, the function SHALL:

1. Merge base styles with the variant styles (variant wins per key)
2. For each style key in the merged result, call `getResponsiveOverrides()`
3. For each responsive override, emit a media query targeting `.mjmlText--{variantName}` with the CSS property and `!important`

For `bottomSpacing` responsive overrides, the CSS SHALL target `.mjmlText--bottomSpacing.mjmlText--{variantName}` (both classes required) and set `padding-bottom`.

When there are no variants or no responsive overrides, the function SHALL emit no CSS.

#### Scenario: Responsive fontSize for a variant

- **WHEN** the theme defines `text: { variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } }`
- **THEN** the registered styles include a media query for the mobile breakpoint targeting `.mjmlText--heading` that sets `font-size: 20px !important`

#### Scenario: Responsive bottomSpacing for a variant

- **WHEN** the theme defines `text: { variants: { heading: { bottomSpacing: { default: 24, mobile: 16 } } } }`
- **THEN** the registered styles include a media query for the mobile breakpoint targeting `.mjmlText--bottomSpacing.mjmlText--heading` that sets `padding-bottom: 16px !important`

#### Scenario: No variants defined

- **WHEN** the theme defines `text: { fontSize: "16px" }` with no `variants`
- **THEN** the registered styles function emits no CSS

#### Scenario: Non-responsive variant values produce no media queries

- **WHEN** the theme defines `text: { variants: { heading: { fontSize: "24px" } } }`
- **THEN** no media queries are emitted for the `heading` variant's `fontSize` (plain value has no responsive overrides)

### Requirement: MjmlText exported props type

The library SHALL export the `MjmlText` component's props type as `MjmlTextProps` from its main entry point.

#### Scenario: Consumer imports MjmlTextProps

- **WHEN** a consumer writes `import type { MjmlTextProps } from "@comet/mail-react"`
- **THEN** the import resolves successfully and the type includes `variant`, `bottomSpacing`, and all base `MjmlText` props

### Requirement: MjmlText replaces re-export

The custom `MjmlText` SHALL replace the existing re-export of `MjmlText` from `@faire/mjml-react`. The base `MjmlText` from `@faire/mjml-react` SHALL NOT be exported from the package. Consumers SHALL only have access to the custom version.

#### Scenario: Import resolves to custom component

- **WHEN** a consumer writes `import { MjmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the custom `MjmlText` component with `variant` and `bottomSpacing` props

### Requirement: TSDoc documentation

`MjmlText` and `MjmlTextProps` SHALL have TSDoc comments. The component TSDoc SHALL describe that it applies theme-based typography styles with optional variant support.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `MjmlText` in their IDE
- **THEN** they see a TSDoc comment explaining theme integration and variant support

### Requirement: Storybook story

A Storybook story SHALL exist at `src/components/text/__stories__/MjmlText.stories.tsx` demonstrating `MjmlText` usage including base styles, variants, and `bottomSpacing`.

#### Scenario: Story renders successfully

- **WHEN** a developer opens Storybook
- **THEN** the `MjmlText` story renders themed text examples

#### Scenario: Autodocs are generated

- **WHEN** the story uses the `autodocs` tag
- **THEN** Storybook generates a docs page showing the component description and props
