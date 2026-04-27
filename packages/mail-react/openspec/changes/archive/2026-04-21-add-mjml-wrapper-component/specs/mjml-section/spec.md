## MODIFIED Requirements

### Requirement: Drop-in replacement for base MjmlSection

The custom `MjmlSection` component SHALL accept all props that the `@faire/mjml-react` `MjmlSection` accepts and forward them to the underlying component. Existing call sites that use `MjmlSection` without any of the new props SHALL produce identical output. The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features are not used.

When a `ThemeProvider` ancestor is present, no explicit `backgroundColor` prop is provided, and the component is NOT inside a custom `MjmlWrapper` subtree, `MjmlSection` SHALL apply `theme.colors.background.content` as the default `backgroundColor` on the underlying component.

When `MjmlSection` is inside a custom `MjmlWrapper` subtree (as detected via the internal `InsideMjmlWrapperContext`), it SHALL NOT apply any default `backgroundColor`, so that the wrapper's background is visible through the section. An explicit `backgroundColor` prop on `MjmlSection` still takes precedence.

When no `ThemeProvider` ancestor is present, `MjmlSection` SHALL NOT apply any default `backgroundColor`.

When an explicit `backgroundColor` prop is provided, it SHALL always take precedence over the theme default, regardless of whether a `ThemeProvider` or a custom `MjmlWrapper` is present.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlSection backgroundColor="#fff" padding="10px">` without any new props
- **THEN** the underlying `@faire/mjml-react` `MjmlSection` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlSection` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor and without theme-dependent props
- **THEN** the component renders successfully without throwing an error and without any default `backgroundColor`

#### Scenario: Theme background applied when theme is present

- **WHEN** `MjmlSection` is rendered inside a `ThemeProvider` without an explicit `backgroundColor` prop and not inside a custom `MjmlWrapper`
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

#### Scenario: No theme default inside custom MjmlWrapper

- **WHEN** `MjmlSection` is rendered inside a `MjmlMailRoot` and inside a custom `MjmlWrapper`, with no explicit `backgroundColor` prop on the section
- **THEN** the underlying `MjmlSection` receives no `backgroundColor` (so the wrapper's background is visible)

#### Scenario: Explicit backgroundColor still wins inside MjmlWrapper

- **WHEN** `MjmlSection` with `backgroundColor="#00FF00"` is rendered inside a custom `MjmlWrapper` with `backgroundColor="#FF0000"` inside a `MjmlMailRoot`
- **THEN** the underlying `MjmlSection` receives `backgroundColor="#00FF00"` (the explicit section prop wins over both the wrapper background and any theme default)
