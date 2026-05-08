## MODIFIED Requirements

### Requirement: HtmlText component

The library SHALL export an `HtmlText` component from its main entry point. `HtmlText` SHALL render a `<td>` element by default, or the element specified by the `component` prop, with inline styles derived from the text theme. It SHALL accept HTML attributes appropriate for the rendered element.

`HtmlText` SHALL require a `ThemeProvider` ancestor and SHALL use `useTheme()` to access the theme.

#### Scenario: Consumer imports HtmlText

- **WHEN** a consumer writes `import { HtmlText } from "@comet/mail-react"`
- **THEN** the import resolves to the `HtmlText` component

#### Scenario: Renders a td element by default

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered within a `ThemeProvider`
- **THEN** the output is a `<td>` element containing "Hello"

#### Scenario: Standard td attributes forwarded

- **WHEN** `<HtmlText colSpan={2} align="center">Hello</HtmlText>` is rendered
- **THEN** the rendered `<td>` has `colspan="2"` and `align="center"`

#### Scenario: Throws without ThemeProvider

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered without a `ThemeProvider` ancestor
- **THEN** the component throws an error indicating that a `ThemeProvider` is required

### Requirement: HtmlTextProps type

The library SHALL export an `HtmlTextProps` type from its main entry point. `HtmlTextProps` SHALL be a generic type `HtmlTextProps<C extends keyof JSX.IntrinsicElements = "td">` that includes:

- `component?: C` — the HTML element to render (defaults to `"td"`)
- `variant?: VariantName` — the text variant to apply from the theme
- `bottomSpacing?: boolean` — when `true`, applies the theme's `bottomSpacing` as `padding-bottom`
- HTML attributes appropriate for element `C` (via `ComponentPropsWithoutRef<C>`, minus own props)

When used without a type argument, `HtmlTextProps` SHALL default to `<td>` attributes, maintaining backwards compatibility.

#### Scenario: Consumer imports HtmlTextProps

- **WHEN** a consumer writes `import type { HtmlTextProps } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Variant prop is type-safe after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** writes `<HtmlText variant="heading">`
- **THEN** the assignment is type-safe

#### Scenario: HtmlTextProps without type argument defaults to td

- **WHEN** a consumer writes `const props: HtmlTextProps = { colSpan: 2 }`
- **THEN** the code compiles (`colSpan` is valid for `<td>`)

#### Scenario: HtmlTextProps with explicit type argument

- **WHEN** a consumer writes `const props: HtmlTextProps<"a"> = { component: "a", href: "/foo" }`
- **THEN** the code compiles (`href` is valid for `<a>`)

### Requirement: CSS class structure

`HtmlText` SHALL always apply the `htmlText` block class. When a variant is active, it SHALL additionally apply `htmlText--{variantName}`. When `bottomSpacing` is `true`, it SHALL additionally apply `htmlText--bottomSpacing`. The component SHALL merge any consumer-provided `className` via `clsx`.

The CSS classes SHALL be applied identically regardless of the rendered element.

#### Scenario: Base class always present

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered
- **THEN** the rendered element has the `htmlText` CSS class

#### Scenario: Base class present with component prop

- **WHEN** `<HtmlText component="div">Hello</HtmlText>` is rendered
- **THEN** the rendered `<div>` has the `htmlText` CSS class

#### Scenario: Variant modifier class

- **WHEN** `<HtmlText variant="heading">Title</HtmlText>` is rendered
- **THEN** the rendered element has both `htmlText` and `htmlText--heading` CSS classes

#### Scenario: Bottom spacing modifier class

- **WHEN** `<HtmlText bottomSpacing>Text</HtmlText>` is rendered
- **THEN** the rendered element has both `htmlText` and `htmlText--bottomSpacing` CSS classes

#### Scenario: Consumer className merged

- **WHEN** `<HtmlText className="custom">Text</HtmlText>` is rendered
- **THEN** the rendered element has `htmlText` and `custom` CSS classes

## ADDED Requirements

### Requirement: component prop

`HtmlText` SHALL accept an optional `component` prop of type `keyof JSX.IntrinsicElements`. When provided, `HtmlText` SHALL render the specified HTML element instead of `<td>`. When omitted, `HtmlText` SHALL render `<td>` (preserving current default behavior).

All theme-derived inline styles, CSS classes, and own props (`variant`, `bottomSpacing`) SHALL behave identically regardless of the rendered element.

#### Scenario: Renders a div when component is "div"

- **WHEN** `<HtmlText component="div">Hello</HtmlText>` is rendered
- **THEN** the output is a `<div>` element (not a `<td>`) containing "Hello" with theme inline styles

#### Scenario: Renders an anchor with href when component is "a"

- **WHEN** `<HtmlText component="a" href="/link">Click</HtmlText>` is rendered
- **THEN** the output is an `<a>` element with `href="/link"` and theme inline styles

#### Scenario: Default behavior unchanged without component prop

- **WHEN** `<HtmlText>Hello</HtmlText>` is rendered without a `component` prop
- **THEN** the output is a `<td>` element (same as before this change)

### Requirement: Element-specific type safety via function overloads

`HtmlText` SHALL use TypeScript function overloads to provide element-specific props based on the `component` value:

1. When `component` is provided with value `C`, the available props SHALL be `ComponentPropsWithoutRef<C>` (minus `HtmlText`'s own props).
2. When `component` is omitted, the available props SHALL be `TdHTMLAttributes<HTMLTableCellElement>` (minus `HtmlText`'s own props).

The implementation SHALL NOT use `as` type assertions.

#### Scenario: href accepted when component is "a"

- **WHEN** a consumer writes `<HtmlText component="a" href="/foo">link</HtmlText>`
- **THEN** the code compiles without type errors

#### Scenario: href rejected when component is omitted

- **WHEN** a consumer writes `<HtmlText href="/foo">text</HtmlText>` (no `component` prop)
- **THEN** TypeScript reports a type error (`href` does not exist on `<td>`)

#### Scenario: colSpan rejected when component is "a"

- **WHEN** a consumer writes `<HtmlText component="a" colSpan={2}>text</HtmlText>`
- **THEN** TypeScript reports a type error (`colSpan` does not exist on `<a>`)

#### Scenario: Own props always accepted

- **WHEN** a consumer writes `<HtmlText component="div" variant="heading" bottomSpacing>text</HtmlText>`
- **THEN** the code compiles without type errors (`variant` and `bottomSpacing` are available regardless of `component`)

### Requirement: Type-level tests

The test file SHALL include type-level tests using `@ts-expect-error` comments that verify invalid prop combinations are rejected by TypeScript. These tests SHALL cover at minimum: `href` without `component="a"`, element-specific props with a mismatched `component`, and own props accepted with any `component` value.

### Requirement: Storybook stories for component prop

The HtmlText stories file SHALL include stories demonstrating the `component` prop, showing `HtmlText` rendered as different HTML elements (e.g., `<div>`, `<a>` with `href`).
