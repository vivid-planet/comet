## MODIFIED Requirements

### Requirement: Drop-in replacement for base MjmlSection

The custom `MjmlSection` component SHALL accept all props that the `@faire/mjml-react` `MjmlSection` accepts and forward them to the underlying component. Existing call sites that use `MjmlSection` without any of the new props SHALL produce identical output. The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features are not used.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlSection backgroundColor="#fff" padding="10px">` without any new props
- **THEN** the underlying `@faire/mjml-react` `MjmlSection` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlSection` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor and without theme-dependent props
- **THEN** the component renders successfully without throwing an error

### Requirement: Content indentation via `indent` prop

The component SHALL accept an `indent` boolean prop (default `false`). When `true`, the component SHALL set `paddingLeft` and `paddingRight` to the default value of `theme.sizes.contentIndentation` (resolved via `getDefaultValue`) on the underlying `MjmlSection`.

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
