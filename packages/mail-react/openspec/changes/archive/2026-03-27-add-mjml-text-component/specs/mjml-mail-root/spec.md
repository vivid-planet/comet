## MODIFIED Requirements

### Requirement: Default zero padding

The `<MjmlHead>` SHALL contain `<MjmlAttributes><MjmlAll padding={0} fontFamily={theme.text.fontFamily} /></MjmlAttributes>` so that all MJML components default to zero padding and the theme's base font family.

#### Scenario: Components inherit zero padding

- **WHEN** `<MjmlMailRoot>` is rendered without any additional configuration
- **THEN** the MJML head includes `<mj-attributes><mj-all padding="0" font-family="Arial, sans-serif" /></mj-attributes>`

#### Scenario: Custom theme fontFamily in MjmlAll

- **WHEN** `<MjmlMailRoot theme={createTheme({ text: { fontFamily: "Georgia, serif" } })}>` is rendered
- **THEN** the MJML head includes `<mj-all ... font-family="Georgia, serif" />`

#### Scenario: No other default attributes beyond padding and fontFamily

- **WHEN** `<MjmlMailRoot>` is rendered
- **THEN** the `<mj-attributes>` block contains only `<mj-all>` with `padding` and `font-family` attributes
