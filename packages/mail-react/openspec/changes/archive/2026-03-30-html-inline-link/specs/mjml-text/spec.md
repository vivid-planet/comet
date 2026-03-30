## MODIFIED Requirements

### Requirement: MjmlText component replaces re-export

The library SHALL export a custom `MjmlText` component from its main entry point, replacing the previous re-export from `@faire/mjml-react`. The custom component SHALL accept all props from `IMjmlTextProps` (the base `@faire/mjml-react` text component) and forward them to the base component.

The component SHALL NOT require a `ThemeProvider` ancestor when theme-dependent features (`variant`, `bottomSpacing`) are not used. When no theme is present and no theme-dependent props are specified, the component SHALL render as a transparent pass-through to the base `MjmlText`, applying no theme-derived inline styles.

When a `ThemeProvider` is present, `MjmlText` SHALL wrap its children in an `OutlookTextStyleProvider`, passing the effective text style values (`fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, `color`). The effective values SHALL be computed by merging the user's explicit props on top of the resolved theme styles (base + variant), so that explicit prop overrides take precedence over theme values. When no `ThemeProvider` is present, `MjmlText` SHALL NOT wrap children in an `OutlookTextStyleProvider`.

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

#### Scenario: OutlookTextStyleProvider wraps children with theme values

- **WHEN** `<MjmlText>content</MjmlText>` is rendered within a `ThemeProvider`
- **AND** the theme has `fontFamily: "Arial"`, `fontSize: "16px"`, `color: "#333"`
- **THEN** an `OutlookTextStyleProvider` ancestor with those values is accessible to descendants via `useOutlookTextStyle()`

#### Scenario: Explicit props override propagate to context

- **WHEN** `<MjmlText color="red">content</MjmlText>` is rendered within a `ThemeProvider`
- **AND** the theme has `color: "#333"`
- **THEN** `useOutlookTextStyle()` returns `color: "red"` (explicit prop wins over theme)

#### Scenario: No OutlookTextStyleProvider without theme

- **WHEN** `<MjmlText>content</MjmlText>` is rendered without a `ThemeProvider`
- **THEN** `useOutlookTextStyle()` called by a descendant returns `null`
