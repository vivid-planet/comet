## Requirements

### Requirement: ResponsiveValue type

The library SHALL export a `ResponsiveValue` type from its main entry point. The type SHALL be generic with a default type parameter `T` equal to `number`. The definition SHALL be `ResponsiveValue<T = number> = T | (Partial<Record<keyof ThemeBreakpoints, T>> & { default: T })`.

When the value is a plain `T`, it SHALL be treated as shorthand for `{ default: <T> }`.

When the value is an object, the `default` key SHALL be required and SHALL be of type `T`. All other keys SHALL be optional, SHALL correspond to keys of `ThemeBreakpoints` (including keys added via module augmentation), and SHALL have values of type `T`.

#### Scenario: Consumer imports ResponsiveValue type

- **WHEN** a consumer writes `import type { ResponsiveValue } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: Plain number is valid with default type parameter

- **WHEN** a consumer assigns `const indent: ResponsiveValue = 20`
- **THEN** the assignment is type-safe

#### Scenario: Object with default is valid for number

- **WHEN** a consumer assigns `const indent: ResponsiveValue = { default: 20, mobile: 10 }`
- **THEN** the assignment is type-safe

#### Scenario: Object without default is invalid

- **WHEN** a consumer assigns `const indent: ResponsiveValue = { mobile: 10 }`
- **THEN** a TypeScript error occurs because `default` is missing

#### Scenario: Augmented breakpoint key accepted

- **WHEN** a consumer has augmented `ThemeBreakpoints` with `tablet: ThemeBreakpoint`
- **THEN** `const indent: ResponsiveValue = { default: 30, tablet: 20, mobile: 10 }` is type-safe

#### Scenario: String-valued responsive token is valid

- **WHEN** a consumer assigns `const lineHeight: ResponsiveValue<string> = { default: "24px", mobile: "20px" }`
- **THEN** the assignment is type-safe and override values are strings

### Requirement: getDefaultFromResponsiveValue helper

The library SHALL export a `getDefaultFromResponsiveValue` function from its main entry point. The function SHALL be generic with default type parameter `T` equal to `number`. Its signature SHALL accept `ResponsiveValue<T>` and return `T`. When the input is a plain `T`, it SHALL return that value. When the input is an object, it SHALL return the `default` property.

#### Scenario: Plain number input

- **WHEN** `getDefaultFromResponsiveValue(20)` is called
- **THEN** it returns `20`

#### Scenario: Object input

- **WHEN** `getDefaultFromResponsiveValue({ default: 20, mobile: 10 })` is called
- **THEN** it returns `20`

#### Scenario: String input with explicit type argument

- **WHEN** `getDefaultFromResponsiveValue<string>({ default: "24px", mobile: "20px" })` is called
- **THEN** it returns `"24px"`

### Requirement: getResponsiveOverrides helper

The library SHALL export a `getResponsiveOverrides` function from its main entry point. The function SHALL be generic with default type parameter `T` equal to `number`. Its signature SHALL accept `ResponsiveValue<T>` and return an array of objects for all non-`default` entries. Each object SHALL have a `breakpointKey` property of type `string` and a `value` property of type `T`. The `default` key SHALL never appear as any `breakpointKey` — it is only consumed via `getDefaultFromResponsiveValue` for inline styles; media-query CSS SHALL use only the overrides returned here. When the input is a plain `T`, the returned array SHALL be empty.

#### Scenario: Plain number input

- **WHEN** `getResponsiveOverrides(20)` is called
- **THEN** it returns an empty array

#### Scenario: Object with mobile override

- **WHEN** `getResponsiveOverrides({ default: 20, mobile: 10 })` is called
- **THEN** it returns `[{ breakpointKey: "mobile", value: 10 }]`

#### Scenario: Object with multiple overrides

- **WHEN** `getResponsiveOverrides({ default: 30, tablet: 20, mobile: 10 })` is called
- **THEN** it returns an array containing `{ breakpointKey: "tablet", value: 20 }` and `{ breakpointKey: "mobile", value: 10 }` (order not significant)

#### Scenario: String overrides preserve type

- **WHEN** `getResponsiveOverrides<string>({ default: "24px", mobile: "20px" })` is called
- **THEN** it returns `[{ breakpointKey: "mobile", value: "20px" }]`

#### Scenario: default key omitted from overrides

- **WHEN** `getResponsiveOverrides({ default: 20, mobile: 10, tablet: 15 })` is called
- **THEN** no entry has `breakpointKey` equal to `"default"` — only `mobile` and `tablet` appear

### Requirement: Theme type interfaces

The library SHALL export the following interfaces from its main entry point: `Theme`, `ThemeSizes`, `ThemeBreakpoints`, and `ThemeBreakpoint`.

`ThemeSizes` SHALL contain a `bodyWidth` property of type `number` with a TSDoc comment describing it as the width of the email body in pixels.

`ThemeSizes` SHALL contain a `contentIndentation` property of type `ResponsiveValue` (the generic default type parameter is `number`) with a TSDoc comment describing it as the content indentation (left/right padding) in pixels, supporting per-breakpoint values.

`ThemeBreakpoint` SHALL contain a `value` property of type `number` and a `belowMediaQuery` property of type `string`.

`ThemeBreakpoints` SHALL contain a `default` property and a `mobile` property, both of type `ThemeBreakpoint`.

The `mobile` property SHALL have a TSDoc comment explaining that it defines the mobile breakpoint and that, when used with `MjmlMailRoot`, this value also controls the MJML responsive breakpoint (`<mj-breakpoint>`), which determines the viewport width at which columns stack vertically.

`Theme` SHALL contain a `sizes` property of type `ThemeSizes` and a `breakpoints` property of type `ThemeBreakpoints`.

All interfaces SHALL support TypeScript module augmentation (declaration merging) so consumers can extend the theme at any level.

#### Scenario: Consumer imports theme interfaces

- **WHEN** a consumer writes `import type { Theme, ThemeSizes, ThemeBreakpoints, ThemeBreakpoint } from "@comet/mail-react"`
- **THEN** all four imports resolve successfully

#### Scenario: ThemeSizes includes contentIndentation

- **WHEN** a consumer accesses `theme.sizes.contentIndentation`
- **THEN** the property exists and is of type `ResponsiveValue` (numeric responsive values via the default type parameter)

#### Scenario: Module augmentation on root Theme

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface Theme { palette: { primary: string } } }`
- **THEN** the augmented `palette` property is present on the `Theme` type

#### Scenario: Module augmentation on nested ThemeSizes

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface ThemeSizes { sidebarWidth: number } }`
- **THEN** the augmented `sidebarWidth` property is present on `Theme["sizes"]`

#### Scenario: Module augmentation on nested ThemeBreakpoints

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface ThemeBreakpoints { tablet: ThemeBreakpoint } }`
- **THEN** the augmented `tablet` property is present on `Theme["breakpoints"]`

### Requirement: Default theme values

The default theme SHALL have `sizes.bodyWidth` equal to `600`.

The default theme SHALL have `sizes.contentIndentation` equal to `{ default: 32, mobile: 16 }`.

The default theme SHALL have `breakpoints.default.value` equal to `600` and `breakpoints.default.belowMediaQuery` equal to `@media (max-width: 599px)`.

The default theme SHALL have `breakpoints.mobile.value` equal to `420` and `breakpoints.mobile.belowMediaQuery` equal to `@media (max-width: 419px)`.

#### Scenario: Default sizes

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `sizes.bodyWidth === 600`

#### Scenario: Default contentIndentation

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `getDefaultFromResponsiveValue(theme.sizes.contentIndentation) === 32`
- **AND** `getResponsiveOverrides(theme.sizes.contentIndentation)` contains `{ breakpointKey: "mobile", value: 16 }`

#### Scenario: Default breakpoints

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `breakpoints.default.value === 600` and `breakpoints.mobile.value === 420`

#### Scenario: Default belowMediaQuery strings

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `breakpoints.default.belowMediaQuery === "@media (max-width: 599px)"` and `breakpoints.mobile.belowMediaQuery === "@media (max-width: 419px)"`

#### Scenario: Override contentIndentation with number

- **WHEN** `createTheme({ sizes: { contentIndentation: 30 } })` is called
- **THEN** `getDefaultFromResponsiveValue(theme.sizes.contentIndentation) === 30` and `getResponsiveOverrides(theme.sizes.contentIndentation)` is empty

#### Scenario: Override contentIndentation with object

- **WHEN** `createTheme({ sizes: { contentIndentation: { default: 30, mobile: 15 } } })` is called
- **THEN** `getDefaultFromResponsiveValue(theme.sizes.contentIndentation) === 30` and `getResponsiveOverrides(theme.sizes.contentIndentation)` contains `{ breakpointKey: "mobile", value: 15 }`

### Requirement: createBreakpoint is exported

The library SHALL export a `createBreakpoint` function from its main entry point. `createBreakpoint` SHALL accept a `value` parameter of type `number` and return a `ThemeBreakpoint` with the corresponding `value` and `belowMediaQuery`.

#### Scenario: Consumer imports createBreakpoint

- **WHEN** a consumer writes `import { createBreakpoint } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: createBreakpoint produces a ThemeBreakpoint

- **WHEN** `createBreakpoint(540)` is called
- **THEN** it returns `{ value: 540, belowMediaQuery: "@media (max-width: 539px)" }`

### Requirement: createTheme function

The library SHALL export a `createTheme` function from its main entry point. `createTheme` SHALL accept an optional partial overrides object and return a complete `Theme`.

The overrides object SHALL accept `sizes` as a partial object (e.g. `{ sizes: { bodyWidth: 700 } }`).

The overrides object SHALL accept `breakpoints` as a partial `ThemeBreakpoints` object containing `ThemeBreakpoint` values (e.g. `{ breakpoints: { mobile: createBreakpoint(480) } }`), NOT as plain numbers. Consumers SHALL use `createBreakpoint` to construct breakpoint override values.

Overrides SHALL be deep-merged with the default theme values.

`createTheme` SHALL handle breakpoint keys dynamically. Any key present in the `breakpoints` overrides — including keys added via module augmentation — SHALL appear in the returned theme's `breakpoints` object.

The built-in breakpoints `default` and `mobile` SHALL always be present in the returned theme, even when not included in overrides.

#### Scenario: Override breakpoint with createBreakpoint

- **WHEN** `createTheme({ breakpoints: { mobile: createBreakpoint(480) } })` is called
- **THEN** the returned theme has `breakpoints.mobile.value === 480` and `breakpoints.mobile.belowMediaQuery === "@media (max-width: 479px)"`

#### Scenario: Unspecified values retain defaults

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 } })` is called without specifying breakpoints.mobile
- **THEN** `breakpoints.mobile.value === 420` (the default)

#### Scenario: breakpoints.default auto-derives from bodyWidth

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 } })` is called without specifying `breakpoints.default`
- **THEN** `breakpoints.default.value === 700`

#### Scenario: Explicit breakpoints.default overrides auto-derivation

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 }, breakpoints: { default: createBreakpoint(650) } })` is called
- **THEN** `breakpoints.default.value === 650` (explicit value wins)

#### Scenario: No arguments produces complete default theme

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the result is identical to the default theme

#### Scenario: Override bodyWidth

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 } })` is called
- **THEN** the returned theme has `sizes.bodyWidth === 700`

#### Scenario: Augmented breakpoint key is included in result

- **WHEN** a consumer has augmented `ThemeBreakpoints` with `tablet: ThemeBreakpoint` and calls `createTheme({ breakpoints: { tablet: createBreakpoint(540) } })`
- **THEN** the returned theme has `breakpoints.tablet.value === 540` and `breakpoints.tablet.belowMediaQuery === "@media (max-width: 539px)"`

#### Scenario: Augmented breakpoint key coexists with built-in breakpoints

- **WHEN** a consumer calls `createTheme({ breakpoints: { tablet: createBreakpoint(540) } })` without specifying `default` or `mobile`
- **THEN** `breakpoints.default` and `breakpoints.mobile` retain their default values alongside the augmented `breakpoints.tablet`

### Requirement: ThemeProvider component

The library SHALL export a `ThemeProvider` component from its main entry point. `ThemeProvider` SHALL accept a `theme` prop of type `Theme` and a `children` prop. It SHALL make the theme available to descendant components via React context.

`ThemeProvider` SHALL be nestable — a nested `ThemeProvider` SHALL override the theme for its subtree.

#### Scenario: Provides theme to children

- **WHEN** a component wrapped in `ThemeProvider` calls `useTheme()`
- **THEN** it receives the `Theme` object passed to the nearest ancestor `ThemeProvider`

#### Scenario: Nested ThemeProvider overrides parent

- **WHEN** an outer `ThemeProvider` provides theme A and an inner `ThemeProvider` provides theme B
- **THEN** components inside the inner provider receive theme B

### Requirement: useTheme hook

The library SHALL export a `useTheme` hook from its main entry point. `useTheme` SHALL return the `Theme` from the nearest ancestor `ThemeProvider`.

`useTheme` SHALL throw an error when called outside of any `ThemeProvider`.

#### Scenario: Returns theme from provider

- **WHEN** `useTheme()` is called inside a `ThemeProvider`
- **THEN** it returns the theme object provided to that `ThemeProvider`

#### Scenario: Throws outside provider

- **WHEN** `useTheme()` is called without any ancestor `ThemeProvider`
- **THEN** it throws an error

### Requirement: Internal useOptionalTheme hook

The `ThemeProvider` module SHALL provide an internal (not exported from the package entry point) `useOptionalTheme` function. The function SHALL return `Theme` when called within a `ThemeProvider` ancestor, and `null` when called without one. The function SHALL NOT throw an error in either case.

#### Scenario: Returns theme when provider is present

- **WHEN** `useOptionalTheme()` is called inside a `ThemeProvider`
- **THEN** it returns the `Theme` object provided to that `ThemeProvider`

#### Scenario: Returns null when no provider is present

- **WHEN** `useOptionalTheme()` is called without any ancestor `ThemeProvider`
- **THEN** it returns `null`

#### Scenario: Not exported from package entry point

- **WHEN** a consumer inspects the public exports of `@comet/mail-react`
- **THEN** `useOptionalTheme` is not available as an export

