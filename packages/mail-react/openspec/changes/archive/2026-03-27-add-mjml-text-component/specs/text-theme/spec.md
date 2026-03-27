## ADDED Requirements

### Requirement: TextStyleMap interface

The library SHALL define an internal `TextStyleMap` interface that serves as the single source of truth for text style property names and their value types. The interface SHALL contain the following properties:

- `fontFamily: string`
- `fontSize: string` — must include a CSS unit (e.g. `"16px"`, `"1rem"`)
- `fontWeight: string | number` — unitless numbers are valid CSS (e.g. `700`)
- `fontStyle: string`
- `lineHeight: string | number` — unitless numbers are valid CSS (e.g. `1.5`)
- `letterSpacing: string` — must include a CSS unit (e.g. `"0.5px"`, `"0.02em"`)
- `textDecoration: string`
- `textTransform: string`
- `color: string`
- `bottomSpacing: number`

`TextStyleMap` SHALL NOT be exported from the package entry point. It is used only to derive `TextStyles` and `TextVariantStyles`.

#### Scenario: TextStyles and TextVariantStyles stay in sync

- **WHEN** a developer adds a new property to `TextStyleMap`
- **THEN** both `TextStyles` and `TextVariantStyles` automatically include the new property via mapped types

### Requirement: TextStyles type

The library SHALL export a `TextStyles` type from its main entry point. `TextStyles` SHALL be a mapped type derived from `TextStyleMap` where each property is optional and has its plain value type: `{ [K in keyof TextStyleMap]?: TextStyleMap[K] }`.

#### Scenario: Consumer imports TextStyles

- **WHEN** a consumer writes `import type { TextStyles } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Plain values are accepted

- **WHEN** a consumer assigns `const styles: TextStyles = { fontFamily: "Arial", fontSize: "16px", fontWeight: 700 }`
- **THEN** the assignment is type-safe

#### Scenario: All properties are optional

- **WHEN** a consumer assigns `const styles: TextStyles = {}`
- **THEN** the assignment is type-safe

### Requirement: TextVariantStyles type

The library SHALL export a `TextVariantStyles` type from its main entry point. `TextVariantStyles` SHALL be a mapped type derived from `TextStyleMap` where each property is optional and wrapped in `ResponsiveValue`: `{ [K in keyof TextStyleMap]?: ResponsiveValue<TextStyleMap[K]> }`.

#### Scenario: Consumer imports TextVariantStyles

- **WHEN** a consumer writes `import type { TextVariantStyles } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Plain values are accepted as responsive shorthand

- **WHEN** a consumer assigns `const styles: TextVariantStyles = { fontSize: "16px" }`
- **THEN** the assignment is type-safe (plain value is valid `ResponsiveValue`)

#### Scenario: Responsive object values are accepted

- **WHEN** a consumer assigns `const styles: TextVariantStyles = { fontSize: { default: "32px", mobile: "24px" } }`
- **THEN** the assignment is type-safe

#### Scenario: TextStyles is assignable to TextVariantStyles

- **WHEN** a value of type `TextStyles` is assigned to a variable of type `TextVariantStyles`
- **THEN** the assignment is type-safe because each plain `T` is a valid `ResponsiveValue<T>`

### Requirement: TextVariants augmentation interface

The library SHALL export a `TextVariants` interface from its main entry point. The interface SHALL be empty by default, serving as an augmentation root for consumer-defined variant names.

When no module augmentation is applied, `keyof TextVariants` SHALL resolve to `never`.

#### Scenario: Consumer imports TextVariants

- **WHEN** a consumer writes `import type { TextVariants } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Module augmentation adds variant keys

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface TextVariants { heading: true; body: true; } }`
- **THEN** `keyof TextVariants` resolves to `"heading" | "body"`

### Requirement: ThemeText interface

The library SHALL export a `ThemeText` interface from its main entry point. `ThemeText` SHALL extend `TextStyles` and additionally contain:

- `defaultVariant?: VariantName` — the variant to apply when no `variant` prop is specified on `MjmlText`
- `variants?: VariantsRecord` — a record of variant name to `TextVariantStyles`

Where `VariantName` and `VariantsRecord` are conditional types that resolve based on whether `TextVariants` has been augmented.

#### Scenario: Consumer imports ThemeText

- **WHEN** a consumer writes `import type { ThemeText } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Base styles without variants

- **WHEN** a consumer defines `const text: ThemeText = { fontFamily: "Georgia", fontSize: "18px" }`
- **THEN** the assignment is type-safe

#### Scenario: Variants with module augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** defines `const text: ThemeText = { fontFamily: "Arial", variants: { heading: { fontSize: { default: "32px", mobile: "24px" } } } }`
- **THEN** the assignment is type-safe

#### Scenario: Invalid variant name rejected after augmentation

- **WHEN** a consumer has augmented `TextVariants` with `{ heading: true; body: true }`
- **AND** defines `const text: ThemeText = { variants: { typo: { fontSize: "16px" } } }`
- **THEN** a TypeScript error occurs because `typo` is not a valid variant key

### Requirement: VariantsRecord conditional type (internal)

The library SHALL define an internal `VariantsRecord` type that is NOT exported from the package entry point. When `keyof TextVariants extends never` (no augmentation), `VariantsRecord` SHALL resolve to `Record<string, TextVariantStyles>`. When `TextVariants` has been augmented, `VariantsRecord` SHALL resolve to `{ [K in keyof TextVariants]?: TextVariantStyles }`.

#### Scenario: Without augmentation allows any string key

- **WHEN** `TextVariants` has not been augmented
- **THEN** `VariantsRecord` allows indexing with any `string` key without type assertions

#### Scenario: With augmentation restricts to known keys

- **WHEN** `TextVariants` has been augmented with `{ heading: true; body: true }`
- **THEN** `VariantsRecord` only allows `heading` and `body` as keys

### Requirement: VariantName conditional type (internal)

The library SHALL define an internal `VariantName` type that is NOT exported from the package entry point. When `keyof TextVariants extends never` (no augmentation), `VariantName` SHALL resolve to `string`. When `TextVariants` has been augmented, `VariantName` SHALL resolve to `keyof TextVariants`.

#### Scenario: Without augmentation accepts any string

- **WHEN** `TextVariants` has not been augmented
- **THEN** `VariantName` is `string`

#### Scenario: With augmentation restricts to known variants

- **WHEN** `TextVariants` has been augmented with `{ heading: true; body: true }`
- **THEN** `VariantName` is `"heading" | "body"`

### Requirement: Default text theme values

The default theme SHALL have `text.fontFamily` equal to `"Arial, sans-serif"`.
The default theme SHALL have `text.fontSize` equal to `"16px"`.
The default theme SHALL have `text.lineHeight` equal to `"20px"`.
The default theme SHALL have `text.bottomSpacing` equal to `16`.
The default theme SHALL NOT have `text.defaultVariant` or `text.variants` set.

#### Scenario: Default text fontFamily

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `text.fontFamily === "Arial, sans-serif"`

#### Scenario: Default text fontSize

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `text.fontSize === "16px"`

#### Scenario: Default text lineHeight

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `text.lineHeight === "20px"`

#### Scenario: Default text bottomSpacing

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `text.bottomSpacing === 16`

#### Scenario: Override text styles

- **WHEN** `createTheme({ text: { fontFamily: "Georgia, serif", fontSize: "18px" } })` is called
- **THEN** the returned theme has `text.fontFamily === "Georgia, serif"` and `text.fontSize === "18px"`
- **AND** unspecified text properties retain their defaults (`text.lineHeight === "20px"`, `text.bottomSpacing === 16`)

#### Scenario: Text overrides with variants

- **WHEN** `createTheme({ text: { variants: { heading: { fontSize: { default: "32px", mobile: "24px" } } } } })` is called
- **THEN** the returned theme includes the variants alongside default base text styles
