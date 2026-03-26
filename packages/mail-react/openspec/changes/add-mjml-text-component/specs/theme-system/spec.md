## MODIFIED Requirements

### Requirement: Theme type interfaces

The library SHALL export the following interfaces from its main entry point: `Theme`, `ThemeSizes`, `ThemeBreakpoints`, and `ThemeBreakpoint`.

`ThemeSizes` SHALL contain a `bodyWidth` property of type `number` with a TSDoc comment describing it as the width of the email body in pixels.

`ThemeSizes` SHALL contain a `contentIndentation` property of type `ResponsiveValue` (the generic default type parameter is `number`) with a TSDoc comment describing it as the content indentation (left/right padding) in pixels, supporting per-breakpoint values.

`ThemeBreakpoint` SHALL contain a `value` property of type `number` and a `belowMediaQuery` property of type `string`.

`ThemeBreakpoints` SHALL contain a `default` property and a `mobile` property, both of type `ThemeBreakpoint`.

The `mobile` property SHALL have a TSDoc comment explaining that it defines the mobile breakpoint and that, when used with `MjmlMailRoot`, this value also controls the MJML responsive breakpoint (`<mj-breakpoint>`), which determines the viewport width at which columns stack vertically.

`Theme` SHALL contain a `sizes` property of type `ThemeSizes` and a `breakpoints` property of type `ThemeBreakpoints`.

`Theme` SHALL contain a `text` property of type `ThemeText`.

All interfaces SHALL support TypeScript module augmentation (declaration merging) so consumers can extend the theme at any level.

#### Scenario: Consumer imports theme interfaces

- **WHEN** a consumer writes `import type { Theme, ThemeSizes, ThemeBreakpoints, ThemeBreakpoint } from "@comet/mail-react"`
- **THEN** all four imports resolve successfully

#### Scenario: ThemeSizes includes contentIndentation

- **WHEN** a consumer accesses `theme.sizes.contentIndentation`
- **THEN** the property exists and is of type `ResponsiveValue` (numeric responsive values via the default type parameter)

#### Scenario: Theme includes text property

- **WHEN** a consumer accesses `theme.text`
- **THEN** the property exists and is of type `ThemeText`

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

The default theme SHALL have the following base text styles:

- `text.fontFamily` equal to `"Arial, sans-serif"`
- `text.fontSize` equal to `"16px"`
- `text.lineHeight` equal to `"20px"`
- `text.bottomSpacing` equal to `16`

All other `text` style properties SHALL be `undefined` by default.

The default theme SHALL have no `text.defaultVariant` and no `text.variants`.

#### Scenario: Default sizes

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `sizes.bodyWidth === 600`

#### Scenario: Default contentIndentation

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `getDefaultValue(theme.sizes.contentIndentation) === 32`
- **AND** `getResponsiveOverrides(theme.sizes.contentIndentation)` contains `{ breakpointKey: "mobile", value: 16 }`

#### Scenario: Default breakpoints

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `breakpoints.default.value === 600` and `breakpoints.mobile.value === 420`

#### Scenario: Default belowMediaQuery strings

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `breakpoints.default.belowMediaQuery === "@media (max-width: 599px)"` and `breakpoints.mobile.belowMediaQuery === "@media (max-width: 419px)"`

#### Scenario: Default text base styles

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `theme.text.fontFamily === "Arial, sans-serif"`
- **AND** `theme.text.fontSize === "16px"`
- **AND** `theme.text.lineHeight === "20px"`
- **AND** `theme.text.bottomSpacing === 16`

#### Scenario: Default text has no variants

- **WHEN** `createTheme()` is called with no arguments
- **THEN** `theme.text.variants` is `undefined` and `theme.text.defaultVariant` is `undefined`

#### Scenario: Override text fontFamily

- **WHEN** `createTheme({ text: { fontFamily: "Georgia, serif" } })` is called
- **THEN** `theme.text.fontFamily === "Georgia, serif"`

#### Scenario: Override text with variants

- **WHEN** `createTheme({ text: { variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } } })` is called
- **THEN** `theme.text.variants.heading.fontSize` deep equals `{ default: "24px", mobile: "20px" }`

### Requirement: createTheme function

The library SHALL export a `createTheme` function from its main entry point. `createTheme` SHALL accept an optional partial overrides object and return a complete `Theme`.

The overrides object SHALL accept `sizes` as a partial object (e.g. `{ sizes: { bodyWidth: 700 } }`).

The overrides object SHALL accept `breakpoints` as a partial `ThemeBreakpoints` object containing `ThemeBreakpoint` values (e.g. `{ breakpoints: { mobile: createBreakpoint(480) } }`), NOT as plain numbers. Consumers SHALL use `createBreakpoint` to construct breakpoint override values.

The overrides object SHALL accept `text` as a partial `ThemeText` object. The `text` override SHALL be shallow-merged with the default text values (spread, not deep-merged). The `variants` property within `text` SHALL be taken as-is from the override when provided.

Overrides for `sizes` and `breakpoints` SHALL be deep-merged with the default theme values.

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

#### Scenario: Text override merges with defaults

- **WHEN** `createTheme({ text: { fontSize: "18px" } })` is called
- **THEN** `theme.text.fontFamily === "Arial, sans-serif"` (default retained) and `theme.text.fontSize === "18px"`
- **AND** `theme.text.lineHeight === "20px"` (default retained) and `theme.text.bottomSpacing === 16` (default retained)
