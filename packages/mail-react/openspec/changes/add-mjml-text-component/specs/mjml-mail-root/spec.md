## MODIFIED Requirements

### Requirement: Default zero padding

The `<MjmlHead>` SHALL contain `<MjmlAttributes>` with `<MjmlAll>` that sets `padding="0"` and `fontFamily` to the value of `theme.text.fontFamily`. This makes zero padding and the theme font family the global defaults for all MJML components.

#### Scenario: Components inherit zero padding

- **WHEN** `<MjmlMailRoot>` is rendered without any additional configuration
- **THEN** the MJML head includes `<mj-attributes><mj-all padding="0" font-family="Arial, sans-serif" /></mj-attributes>`

#### Scenario: Custom theme fontFamily

- **WHEN** `<MjmlMailRoot theme={createTheme({ text: { fontFamily: "Georgia, serif" } })}>` is rendered
- **THEN** the `<mj-all>` element includes `font-family="Georgia, serif"`

#### Scenario: No other default attributes beyond padding and fontFamily

- **WHEN** `<MjmlMailRoot>` is rendered
- **THEN** the `<mj-attributes>` block contains only `<mj-all>` with `padding` and `fontFamily` attributes and no other attribute elements
