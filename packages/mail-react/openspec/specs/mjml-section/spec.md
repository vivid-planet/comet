## Requirements

### Requirement: Drop-in replacement for base MjmlSection

The custom `MjmlSection` component SHALL accept all props that the `@faire/mjml-react` `MjmlSection` accepts and forward them to the underlying component. Existing call sites that use `MjmlSection` without any of the new props SHALL produce identical output. The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features are not used.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlSection backgroundColor="#fff" padding="10px">` without any new props
- **THEN** the underlying `@faire/mjml-react` `MjmlSection` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlSection` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor and without theme-dependent props
- **THEN** the component renders successfully without throwing an error

### Requirement: Disable responsive behavior via `disableResponsiveBehavior` prop

The component SHALL accept a `disableResponsiveBehavior` boolean prop (default `false`). When `true`, all children SHALL be wrapped in a single `MjmlGroup` element, preventing columns from stacking vertically on mobile viewports.

#### Scenario: Default behavior (responsive)

- **WHEN** `disableResponsiveBehavior` is not set or `false`
- **THEN** children are rendered directly inside the section without a `MjmlGroup` wrapper

#### Scenario: Responsive behavior disabled

- **WHEN** `disableResponsiveBehavior` is `true`
- **THEN** children are wrapped in a single `MjmlGroup` element

### Requirement: SlotProps for sub-element customization

The component SHALL accept a `slotProps` object prop with an optional `group` key. The value of `group` SHALL be a partial set of `MjmlGroupProps` that are spread onto the `MjmlGroup` element when it is rendered (i.e., when `disableResponsiveBehavior` is `true`).

#### Scenario: SlotProps applied to group

- **WHEN** `disableResponsiveBehavior` is `true` AND `slotProps={{ group: { width: "50%" } }}`
- **THEN** the `MjmlGroup` element receives `width="50%"`

#### Scenario: SlotProps ignored when group not rendered

- **WHEN** `disableResponsiveBehavior` is `false` AND `slotProps={{ group: { width: "50%" } }}`
- **THEN** no `MjmlGroup` is rendered and the `slotProps.group` values have no effect

### Requirement: BEM class name and className merging

The component SHALL always apply the block class name `mjmlSection` to the underlying element. When `indent` is `true`, the component SHALL additionally apply the BEM modifier class `mjmlSection--indented`.

Any consumer-provided `className` prop SHALL be merged with the internal class names using `clsx`, with the consumer className as the last argument.

#### Scenario: Block class always present

- **WHEN** `MjmlSection` is rendered without any custom props
- **THEN** the underlying element receives `className="mjmlSection"`

#### Scenario: Consumer className merged

- **WHEN** a consumer passes `className="custom"`
- **THEN** the underlying element receives a className containing both `"mjmlSection"` and `"custom"`

#### Scenario: Modifier and consumer className merged

- **WHEN** a consumer passes `className="custom"` along with `indent`
- **THEN** the underlying element receives a className containing `"mjmlSection"`, `"mjmlSection--indented"`, and `"custom"`

### Requirement: Content indentation via `indent` prop

The component SHALL accept an `indent` boolean prop (default `false`). When `true`, the component SHALL set `paddingLeft` and `paddingRight` to the default value of `theme.sizes.contentIndentation` (resolved via `getDefaultFromResponsiveValue`) on the underlying `MjmlSection`.

When `indent` is `false` or not provided, no indentation padding SHALL be applied by the component.

When `indent` is `true` and no `ThemeProvider` ancestor is present, the component SHALL throw an error with a message indicating that the `indent` prop requires a `ThemeProvider` or `MjmlMailRoot`.

#### Scenario: Indentation enabled with number

- **WHEN** `indent` is `true` and the theme has `sizes.contentIndentation === 20`
- **THEN** the underlying `MjmlSection` receives `paddingLeft={20}` and `paddingRight={20}`

#### Scenario: Indentation enabled with responsive object

- **WHEN** `indent` is `true` and the theme has `sizes.contentIndentation === { default: 30, mobile: 15 }`
- **THEN** the underlying `MjmlSection` receives `paddingLeft={30}` and `paddingRight={30}` (the default value)

#### Scenario: Indentation disabled (default)

- **WHEN** `indent` is not set or `false`
- **THEN** no `paddingLeft` or `paddingRight` is set by the component

#### Scenario: Indent without ThemeProvider throws targeted error

- **WHEN** `indent` is `true` and there is no `ThemeProvider` or `MjmlMailRoot` ancestor
- **THEN** the component throws an error with a message indicating that `indent` requires a `ThemeProvider` or `MjmlMailRoot`

### Requirement: Responsive indentation overrides via registered styles

When the `MjmlSection` module is imported, it SHALL register responsive styles (via `registerStyles`) that iterate only the objects returned by `getResponsiveOverrides(theme.sizes.contentIndentation)` — never the `default` key, which is applied only as inline padding — and generate a media query for each entry's `breakpointKey` and `value`, using the corresponding breakpoint's `belowMediaQuery` to override left/right padding on sections with the `mjmlSection--indented` class.

#### Scenario: Mobile indentation in rendered HTML

- **WHEN** `MjmlSection` is used with `indent`, the theme has `sizes.contentIndentation === { default: 20, mobile: 10 }`, and the email is rendered via `renderMailHtml`
- **THEN** the resulting HTML contains a CSS media query below the mobile breakpoint that sets left/right padding to `10px` for indented sections

#### Scenario: Multiple breakpoint overrides

- **WHEN** the theme has `sizes.contentIndentation === { default: 30, tablet: 20, mobile: 10 }` and corresponding breakpoints
- **THEN** the registered styles contain one media query per non-default key, each using the appropriate `belowMediaQuery` and padding value

#### Scenario: No overrides when number value

- **WHEN** the theme has `sizes.contentIndentation === 20` (plain number)
- **THEN** no responsive styles are generated for indentation (only inline padding applies)

### Requirement: Props type exported

The component's props type SHALL be exported as `MjmlSectionProps` from the package entry point, replacing the previous re-export of `@faire/mjml-react`'s type. The base component and type SHALL NOT be exposed — consumers only interact with the custom version.

#### Scenario: Custom props type importable

- **WHEN** a consumer writes `import { type MjmlSectionProps } from "@comet/mail-react"`
- **THEN** the type includes the custom props (`indent`, `disableResponsiveBehavior`, `slotProps`) in addition to all base section props

