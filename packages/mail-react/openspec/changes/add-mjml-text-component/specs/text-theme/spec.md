## ADDED Requirements

### Requirement: TextStyles interface

The library SHALL export a `TextStyles` interface from its main entry point. `TextStyles` SHALL contain the following optional properties with plain (non-responsive) value types:

- `fontFamily?: string`
- `fontSize?: string | number`
- `fontWeight?: string | number`
- `fontStyle?: string`
- `lineHeight?: string | number`
- `letterSpacing?: string | number`
- `textDecoration?: string`
- `textTransform?: string`
- `color?: string`
- `bottomSpacing?: number`

Properties typed `string | number` accept either a CSS string (e.g., `"16px"`) or a bare number. A bare number means pixels for `fontSize` and `letterSpacing`, a unitless multiplier for `lineHeight`, and a numeric weight for `fontWeight`. These types match the upstream `@faire/mjml-react` `MjmlText` prop types. `bottomSpacing` is always in pixels.

#### Scenario: Consumer imports TextStyles

- **WHEN** a consumer writes `import type { TextStyles } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: All properties are optional

- **WHEN** a consumer assigns `const styles: TextStyles = {}`
- **THEN** the assignment is type-safe

#### Scenario: Plain string values only

- **WHEN** a consumer assigns `const styles: TextStyles = { fontSize: { default: "16px", mobile: "14px" } }`
- **THEN** a TypeScript error occurs because `fontSize` expects `string`, not a responsive object

### Requirement: TextVariantStyles interface

The library SHALL export a `TextVariantStyles` interface from its main entry point. `TextVariantStyles` SHALL contain the same keys as `TextStyles` but with `ResponsiveValue<T>` value types:

- `fontFamily?: ResponsiveValue<string>`
- `fontSize?: ResponsiveValue<string | number>`
- `fontWeight?: ResponsiveValue<string | number>`
- `fontStyle?: ResponsiveValue<string>`
- `lineHeight?: ResponsiveValue<string | number>`
- `letterSpacing?: ResponsiveValue<string | number>`
- `textDecoration?: ResponsiveValue<string>`
- `textTransform?: ResponsiveValue<string>`
- `color?: ResponsiveValue<string>`
- `bottomSpacing?: ResponsiveValue`

#### Scenario: Consumer imports TextVariantStyles

- **WHEN** a consumer writes `import type { TextVariantStyles } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Responsive fontSize in variant

- **WHEN** a consumer assigns `const styles: TextVariantStyles = { fontSize: { default: "24px", mobile: "20px" } }`
- **THEN** the assignment is type-safe

#### Scenario: Plain values are valid

- **WHEN** a consumer assigns `const styles: TextVariantStyles = { fontSize: "24px" }`
- **THEN** the assignment is type-safe (a plain value is a valid `ResponsiveValue`)

### Requirement: TextVariants interface

The library SHALL export a `TextVariants` interface from its main entry point. `TextVariants` SHALL be empty by default and SHALL support TypeScript module augmentation so consumers can add variant names.

#### Scenario: Consumer imports TextVariants

- **WHEN** a consumer writes `import type { TextVariants } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Empty by default

- **WHEN** no module augmentation is applied
- **THEN** `keyof TextVariants` resolves to `never`

#### Scenario: Module augmentation adds variants

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface TextVariants { heading: true; body: true; caption: true; } }`
- **THEN** `keyof TextVariants` resolves to `"heading" | "body" | "caption"`

### Requirement: ThemeText interface

The library SHALL export a `ThemeText` interface from its main entry point. `ThemeText` SHALL extend `TextStyles` (inheriting all base style properties at the root level) and SHALL additionally contain:

- `defaultVariant?: keyof TextVariants` — the variant to apply when the `variant` prop is not set on `MjmlText`
- `variants?: { [K in keyof TextVariants]?: TextVariantStyles }` — per-variant style overrides

#### Scenario: Consumer imports ThemeText

- **WHEN** a consumer writes `import type { ThemeText } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Base styles at root level

- **WHEN** a consumer assigns `const text: ThemeText = { fontFamily: "Arial", fontSize: "16px" }`
- **THEN** the assignment is type-safe

#### Scenario: Variants with augmented TextVariants

- **WHEN** a consumer has augmented `TextVariants` with `heading` and `body`
- **THEN** `const text: ThemeText = { variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } }` is type-safe

#### Scenario: defaultVariant typed to variant keys

- **WHEN** a consumer has augmented `TextVariants` with `heading` and `body`
- **THEN** `const text: ThemeText = { defaultVariant: "heading" }` is type-safe
- **AND** `const text: ThemeText = { defaultVariant: "unknown" }` produces a TypeScript error

#### Scenario: ThemeText supports module augmentation

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface ThemeText { customProp: string } }`
- **THEN** the augmented `customProp` property is present on the `ThemeText` type
