## MODIFIED Requirements

### Requirement: Drop-in replacement for base MjmlSection

The custom `MjmlSection` component SHALL accept all props that the `@faire/mjml-react` `MjmlSection` accepts and forward them to the underlying component. Existing call sites that use `MjmlSection` without any of the new props SHALL produce identical output. The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features are not used.

When a `ThemeProvider` ancestor is present and no explicit `backgroundColor` prop is provided, `MjmlSection` SHALL apply `theme.colors.background.content` as the default `backgroundColor` on the underlying component.

When no `ThemeProvider` ancestor is present, `MjmlSection` SHALL NOT apply any default `backgroundColor`.

When an explicit `backgroundColor` prop is provided, it SHALL always take precedence over the theme default, regardless of whether a `ThemeProvider` is present.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlSection backgroundColor="#fff" padding="10px">` without any new props
- **THEN** the underlying `@faire/mjml-react` `MjmlSection` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlSection` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor and without theme-dependent props
- **THEN** the component renders successfully without throwing an error and without any default `backgroundColor`

#### Scenario: Theme background applied when theme is present

- **WHEN** `MjmlSection` is rendered inside a `ThemeProvider` without an explicit `backgroundColor` prop
- **THEN** the underlying component receives `backgroundColor` equal to `theme.colors.background.content`

#### Scenario: Default theme background is white

- **WHEN** `MjmlSection` is rendered inside a `MjmlMailRoot` with the default theme and without an explicit `backgroundColor` prop
- **THEN** the underlying component receives `backgroundColor="#FFFFFF"`

#### Scenario: Explicit backgroundColor overrides theme default

- **WHEN** `MjmlSection` is rendered inside a `ThemeProvider` with `backgroundColor="#FF0000"`
- **THEN** the underlying component receives `backgroundColor="#FF0000"` (the explicit prop wins)

#### Scenario: Custom theme content background

- **WHEN** `MjmlSection` is rendered inside a `MjmlMailRoot` with `createTheme({ colors: { background: { content: "#F0F0F0" } } })` and without an explicit `backgroundColor` prop
- **THEN** the underlying component receives `backgroundColor="#F0F0F0"`
