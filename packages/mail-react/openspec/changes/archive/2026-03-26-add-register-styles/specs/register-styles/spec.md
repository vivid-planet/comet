## ADDED Requirements

### Requirement: registerStyles function

The library SHALL export a `registerStyles` function from its main entry point. `registerStyles` SHALL accept a `styles` parameter of type `ReturnType<typeof css> | ((theme: Theme) => ReturnType<typeof css>)`, where `css` is the tagged template helper already exported from this package, and an optional `mjmlStyleProps` parameter of type `Partial<Omit<MjmlStyleProps, "children">>`. The library SHALL NOT add a separate exported type alias for `ReturnType<typeof css>`; that type is referenced only via `typeof css` in the implementation signature.

The function SHALL store the registration in a module-scoped registry using the `styles` value itself as the deduplication key (function reference for functions, `ReturnType<typeof css>` value for static CSS entries). Calling `registerStyles` with the same `styles` reference SHALL overwrite the previous entry rather than creating a duplicate.

#### Scenario: Register string styles

- **WHEN** `registerStyles` is called with a `ReturnType<typeof css>` value (e.g. the result of `` css`…` ``)
- **THEN** the value is stored in the registry and will be rendered inside an `<mj-style>` tag

#### Scenario: Register function styles

- **WHEN** `registerStyles` is called with a `(theme: Theme) => ReturnType<typeof css>` function
- **THEN** the function is stored in the registry and will be called with the active theme at render time

#### Scenario: Deduplication by function reference

- **WHEN** `registerStyles` is called twice with the same function reference
- **THEN** only one entry exists in the registry

#### Scenario: Deduplication by string content

- **WHEN** `registerStyles` is called twice with identical CSS strings
- **THEN** only one entry exists in the registry

#### Scenario: mjmlStyleProps forwarded

- **WHEN** `registerStyles` is called with `{ inline: true }` as the second argument
- **THEN** the rendered `<MjmlStyle>` element receives the `inline` prop

### Requirement: Internal rendering of registered styles

The library SHALL implement an internal component (not exported from the package entry point) that iterates over all entries in the styles registry and renders one `<MjmlStyle>` element per entry. `MjmlMailRoot` SHALL render this component inside `<MjmlHead>`. For function-style entries, the function SHALL be called with the current theme (via `useTheme()`) to produce a `ReturnType<typeof css>` value for rendering.

The package entry point SHALL NOT export the internal head-rendering component. No additional exported type alias SHALL be required for the `registerStyles` payload beyond typing it as `ReturnType<typeof css> | ((theme: Theme) => ReturnType<typeof css>)` as above.

#### Scenario: String styles rendered as-is

- **WHEN** the registry contains a string-style entry and `MjmlMailRoot` is rendered
- **THEN** the output contains `<MjmlStyle>` with that CSS string

#### Scenario: Function styles resolved with theme

- **WHEN** the registry contains a function-style entry and `MjmlMailRoot` is rendered with a theme
- **THEN** the function is called with the theme and the resulting string is rendered inside `<MjmlStyle>`

#### Scenario: Multiple entries rendered

- **WHEN** the registry contains three entries and `MjmlMailRoot` is rendered
- **THEN** three `<MjmlStyle>` elements are produced in the head

#### Scenario: mjmlStyleProps applied

- **WHEN** a registry entry was registered with `{ inline: true }`
- **THEN** the corresponding `<MjmlStyle>` element has the `inline` attribute

### Requirement: Registered styles appear in rendered HTML

When `renderMailHtml` is called on a component tree that includes `MjmlMailRoot`, all styles registered via `registerStyles` (from imported modules) SHALL appear as `<style>` blocks in the final HTML output.

#### Scenario: End-to-end style registration

- **WHEN** a module calls `registerStyles` with CSS targeting `.myComponent`, and a component tree using `MjmlMailRoot` is rendered via `renderMailHtml`
- **THEN** the resulting HTML contains the `.myComponent` CSS rules inside a `<style>` block
