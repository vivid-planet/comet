## MODIFIED Requirements

### Requirement: Email skeleton rendering

`MjmlMailRoot` SHALL render the standard MJML email structure: `<Mjml>` wrapping `<MjmlHead>` and `<MjmlBody>`. Children passed to `MjmlMailRoot` SHALL be rendered inside `<MjmlBody>`.

`MjmlMailRoot` SHALL set the `width` attribute on `<MjmlBody>` to the value of `theme.sizes.bodyWidth` from the resolved theme, formatted as a pixel string (e.g. `"600px"`).

`MjmlMailRoot` SHALL set the `backgroundColor` attribute on `<MjmlBody>` to the value of `theme.colors.background.body` from the resolved theme.

`MjmlMailRoot` SHALL render `<MjmlBreakpoint width={theme.breakpoints.mobile.value + "px"} />` inside `<MjmlHead>`, setting the MJML responsive breakpoint from the theme's mobile breakpoint value.

`MjmlMailRoot` SHALL render registered styles inside `<MjmlHead>`, after the `<MjmlBreakpoint>` element, using an internal implementation component that is not exported from the package, so that all styles registered via `registerStyles` are included in the email output.

`MjmlMailRoot` SHALL wrap its children in a `ThemeProvider`, making the resolved theme available to all descendant components via `useTheme()`.

#### Scenario: Basic email with a section

- **WHEN** `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` is rendered
- **THEN** the output MJML contains `<mjml><mj-head>...</mj-head><mj-body><mj-section>...</mj-section></mj-body></mjml>`

#### Scenario: Body width from theme

- **WHEN** `<MjmlMailRoot>` is rendered with no theme prop
- **THEN** the `<mj-body>` element has `width="600px"` (the default `sizes.bodyWidth`)

#### Scenario: Body background color from theme

- **WHEN** `<MjmlMailRoot>` is rendered with no theme prop
- **THEN** the `<mj-body>` element has `background-color="#F2F2F2"` (the default `colors.background.body`)

#### Scenario: Custom theme body background color

- **WHEN** `<MjmlMailRoot theme={createTheme({ colors: { background: { body: "#EAEAEA" } } })}>` is rendered
- **THEN** the `<mj-body>` element has `background-color="#EAEAEA"`

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
