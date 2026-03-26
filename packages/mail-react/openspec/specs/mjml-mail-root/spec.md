## Requirements

### Requirement: Email skeleton rendering

`MjmlMailRoot` SHALL render the standard MJML email structure: `<Mjml>` wrapping `<MjmlHead>` and `<MjmlBody>`. Children passed to `MjmlMailRoot` SHALL be rendered inside `<MjmlBody>`.

`MjmlMailRoot` SHALL set the `width` attribute on `<MjmlBody>` to the value of `theme.sizes.bodyWidth` from the resolved theme, formatted as a pixel string (e.g. `"600px"`).

`MjmlMailRoot` SHALL render `<MjmlBreakpoint width={theme.breakpoints.mobile.value + "px"} />` inside `<MjmlHead>`, setting the MJML responsive breakpoint from the theme's mobile breakpoint value.

`MjmlMailRoot` SHALL render registered styles inside `<MjmlHead>`, after the `<MjmlBreakpoint>` element, using an internal implementation component that is not exported from the package, so that all styles registered via `registerStyles` are included in the email output.

`MjmlMailRoot` SHALL wrap its children in a `ThemeProvider`, making the resolved theme available to all descendant components via `useTheme()`.

#### Scenario: Basic email with a section

- **WHEN** `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` is rendered
- **THEN** the output MJML contains `<mjml><mj-head>...</mj-head><mj-body><mj-section>...</mj-section></mj-body></mjml>`

#### Scenario: Body width from theme

- **WHEN** `<MjmlMailRoot>` is rendered with no theme prop
- **THEN** the `<mj-body>` element has `width="600px"` (the default `sizes.bodyWidth`)

#### Scenario: Custom theme body width

- **WHEN** `<MjmlMailRoot theme={createTheme({ sizes: { bodyWidth: 700 } })}>` is rendered
- **THEN** the `<mj-body>` element has `width="700px"`

#### Scenario: MJML breakpoint from theme

- **WHEN** `<MjmlMailRoot>` is rendered with no theme prop
- **THEN** the `<mj-head>` contains `<mj-breakpoint width="420px" />` (the default `breakpoints.mobile.value`)

#### Scenario: Custom theme mobile breakpoint

- **WHEN** `<MjmlMailRoot theme={createTheme({ breakpoints: { mobile: 480 } })}>` is rendered
- **THEN** the `<mj-head>` contains `<mj-breakpoint width="480px" />`

#### Scenario: Theme is available to children

- **WHEN** a child component of `MjmlMailRoot` calls `useTheme()`
- **THEN** it receives the theme provided to (or defaulted by) `MjmlMailRoot`

#### Scenario: Registered styles appear in head

- **WHEN** a module has called `registerStyles` with CSS, and `MjmlMailRoot` is rendered
- **THEN** the `<mj-head>` contains `<mj-style>` elements with the registered CSS

### Requirement: Default zero padding

The `<MjmlHead>` SHALL contain `<MjmlAttributes><MjmlAll padding={0} /></MjmlAttributes>` so that all MJML components default to zero padding.

#### Scenario: Components inherit zero padding

- **WHEN** `<MjmlMailRoot>` is rendered without any additional configuration
- **THEN** the MJML head includes `<mj-attributes><mj-all padding="0" /></mj-attributes>`

#### Scenario: No other default attributes

- **WHEN** `<MjmlMailRoot>` is rendered
- **THEN** the `<mj-attributes>` block contains only `<mj-all padding="0" />` and no other attribute elements

### Requirement: Optional theme prop

`MjmlMailRoot` SHALL accept an optional `theme` prop of type `Theme`. When `theme` is not provided, `MjmlMailRoot` SHALL use the default theme (equivalent to `createTheme()` with no arguments).

#### Scenario: No theme prop uses defaults

- **WHEN** `<MjmlMailRoot>` is rendered without a `theme` prop
- **THEN** the default theme is used and `<mj-body>` has `width="600px"`

#### Scenario: Explicit theme prop is respected

- **WHEN** `<MjmlMailRoot theme={myTheme}>` is rendered with a custom theme
- **THEN** the provided theme is used for body width and is available via `useTheme()`

### Requirement: Exported from package entry point

`MjmlMailRoot` SHALL be exported from the package's main entry point (`src/index.ts`).

#### Scenario: Consumer imports MjmlMailRoot

- **WHEN** a consumer writes `import { MjmlMailRoot } from "@comet/mail-react"`
- **THEN** the import resolves to the `MjmlMailRoot` component

### Requirement: TSDoc documentation

`MjmlMailRoot` SHALL have a TSDoc comment on the component describing purpose and usage constraints, including that it accepts an optional `theme` prop.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `MjmlMailRoot` in their IDE
- **THEN** they see a TSDoc comment explaining that it is the root element for email templates and accepts an optional theme

### Requirement: Storybook story

A Storybook story SHALL exist at `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx` demonstrating `MjmlMailRoot` usage.

#### Scenario: Story renders successfully

- **WHEN** a developer opens Storybook
- **THEN** the `MjmlMailRoot` story renders a complete email skeleton as HTML

#### Scenario: Autodocs are generated

- **WHEN** the story uses the `autodocs` tag
- **THEN** Storybook generates a docs page showing the component description and props
