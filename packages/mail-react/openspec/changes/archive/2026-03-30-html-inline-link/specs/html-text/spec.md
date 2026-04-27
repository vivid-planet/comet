## MODIFIED Requirements

### Requirement: HtmlText component

The library SHALL export an `HtmlText` component from its main entry point. `HtmlText` SHALL render a `<td>` element with inline styles derived from the text theme. It SHALL accept all standard `<td>` HTML attributes via `TdHTMLAttributes<HTMLTableCellElement>`.

`HtmlText` SHALL require a `ThemeProvider` ancestor and SHALL use `useTheme()` to access the theme.

`HtmlText` SHALL wrap its children in an `OutlookTextStyleProvider`, passing the effective text style values (`fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, `color`). The effective values SHALL be computed by merging the user's `style` prop on top of the resolved theme styles (base + variant), so that explicit `style` overrides take precedence over theme values.

#### Scenario: Consumer imports HtmlText

- **WHEN** a consumer writes `import { HtmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the `HtmlText` component

#### Scenario: Renders a td element

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered within a `ThemeProvider`
- **THEN** the output is a `<td>` element containing "Hello"

#### Scenario: Standard td attributes forwarded

- **WHEN** `<HtmlText colSpan={2} align="center">Hello</HtmlText>` is rendered
- **THEN** the rendered `<td>` has `colspan="2"` and `align="center"`

#### Scenario: Throws without ThemeProvider

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered without a `ThemeProvider` ancestor
- **THEN** the component throws an error indicating that a `ThemeProvider` is required

#### Scenario: OutlookTextStyleProvider wraps children with theme values

- **WHEN** `<HtmlText>content</HtmlText>` is rendered within a `ThemeProvider`
- **AND** the theme has `fontFamily: "Arial"`, `fontSize: "16px"`, `color: "#333"`
- **THEN** an `OutlookTextStyleProvider` ancestor with those values is accessible to descendants via `useOutlookTextStyle()`

#### Scenario: Style prop overrides propagate to context

- **WHEN** `<HtmlText style={{ color: "red" }}>content</HtmlText>` is rendered within a `ThemeProvider`
- **AND** the theme has `color: "#333"`
- **THEN** `useOutlookTextStyle()` returns `color: "red"` (style prop wins over theme)
