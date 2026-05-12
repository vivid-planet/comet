## MODIFIED Requirements

### Requirement: Theme type interfaces

The library SHALL export the following interfaces from its main entry point: `Theme`, `ThemeSizes`, `ThemeBreakpoints`, `ThemeBreakpoint`, `ThemeText`, `TextStyles`, `TextVariantStyles`, `TextVariants`, `ThemeColors`, `ThemeBackgroundColors`.

`ThemeBackgroundColors` SHALL contain a `body` property of type `string` and a `content` property of type `string`.

`ThemeColors` SHALL contain a `background` property of type `ThemeBackgroundColors`.

`ThemeSizes` SHALL contain a `bodyWidth` property of type `number` with a TSDoc comment describing it as the width of the email body in pixels.

`ThemeSizes` SHALL contain a `contentIndentation` property of type `ResponsiveValue` (the generic default type parameter is `number`) with a TSDoc comment describing it as the content indentation (left/right padding) in pixels, supporting per-breakpoint values.

`ThemeBreakpoint` SHALL contain a `value` property of type `number` and a `belowMediaQuery` property of type `string`.

`ThemeBreakpoints` SHALL contain a `default` property and a `mobile` property, both of type `ThemeBreakpoint`.

The `mobile` property SHALL have a TSDoc comment explaining that it defines the mobile breakpoint and that, when used with `MjmlMailRoot`, this value also controls the MJML responsive breakpoint (`<mj-breakpoint>`), which determines the viewport width at which columns stack vertically.

`Theme` SHALL contain a `sizes` property of type `ThemeSizes`, a `breakpoints` property of type `ThemeBreakpoints`, a `text` property of type `ThemeText`, and a `colors` property of type `ThemeColors`.

All interfaces SHALL support TypeScript module augmentation (declaration merging) so consumers can extend the theme at any level.

#### Scenario: Consumer imports theme interfaces

- **WHEN** a consumer writes `import type { Theme, ThemeSizes, ThemeBreakpoints, ThemeBreakpoint, ThemeText } from "@comet/mail-react"`
- **THEN** all imports resolve successfully

#### Scenario: Consumer imports text type interfaces

- **WHEN** a consumer writes `import type { TextStyles, TextVariantStyles, TextVariants } from "@comet/mail-react"`
- **THEN** all imports resolve successfully

#### Scenario: Consumer imports color type interfaces

- **WHEN** a consumer writes `import type { ThemeColors, ThemeBackgroundColors } from "@comet/mail-react"`
- **THEN** all imports resolve successfully

#### Scenario: Theme includes colors property

- **WHEN** a consumer accesses `theme.colors`
- **THEN** the property exists and is of type `ThemeColors`

#### Scenario: ThemeColors includes background

- **WHEN** a consumer accesses `theme.colors.background`
- **THEN** the property exists and is of type `ThemeBackgroundColors` with `body` and `content` string properties

#### Scenario: Theme includes text property

- **WHEN** a consumer accesses `theme.text`
- **THEN** the property exists and is of type `ThemeText`

#### Scenario: ThemeSizes includes contentIndentation

- **WHEN** a consumer accesses `theme.sizes.contentIndentation`
- **THEN** the property exists and is of type `ResponsiveValue` (numeric responsive values via the default type parameter)

#### Scenario: Module augmentation on ThemeBackgroundColors

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface ThemeBackgroundColors { sidebar: string } }`
- **THEN** the augmented `sidebar` property is present on `Theme["colors"]["background"]`

#### Scenario: Module augmentation on ThemeColors

- **WHEN** a consumer declares `declare module "@comet/mail-react" { interface ThemeColors { brand: { primary: string } } }`
- **THEN** the augmented `brand` property is present on `Theme["colors"]`

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

The default theme SHALL have `colors.background.body` equal to `"#F2F2F2"`.

The default theme SHALL have `colors.background.content` equal to `"#FFFFFF"`.

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

#### Scenario: Default background colors

- **WHEN** `createTheme()` is called with no arguments
- **THEN** the returned theme has `colors.background.body === "#F2F2F2"` and `colors.background.content === "#FFFFFF"`

#### Scenario: Override contentIndentation with number

- **WHEN** `createTheme({ sizes: { contentIndentation: 30 } })` is called
- **THEN** `getDefaultValue(theme.sizes.contentIndentation) === 30` and `getResponsiveOverrides(theme.sizes.contentIndentation)` is empty

#### Scenario: Override contentIndentation with object

- **WHEN** `createTheme({ sizes: { contentIndentation: { default: 30, mobile: 15 } } })` is called
- **THEN** `getDefaultValue(theme.sizes.contentIndentation) === 30` and `getResponsiveOverrides(theme.sizes.contentIndentation)` contains `{ breakpointKey: "mobile", value: 15 }`

### Requirement: createTheme function

The library SHALL export a `createTheme` function from its main entry point. `createTheme` SHALL accept an optional partial overrides object and return a complete `Theme`.

The overrides object SHALL accept `sizes` as a partial object (e.g. `{ sizes: { bodyWidth: 700 } }`).

The overrides object SHALL accept `breakpoints` as a partial `ThemeBreakpoints` object containing `ThemeBreakpoint` values (e.g. `{ breakpoints: { mobile: createBreakpoint(480) } }`), NOT as plain numbers. Consumers SHALL use `createBreakpoint` to construct breakpoint override values.

The overrides object SHALL accept `text` as a partial `ThemeText` object (e.g. `{ text: { fontFamily: "Georgia" } }`). Text overrides SHALL be shallow-merged with the default text values.

The overrides object SHALL accept `colors` as a partial nested object. `colors.background` SHALL accept a partial `ThemeBackgroundColors` (e.g. `{ colors: { background: { body: "#EEE" } } }`). Color overrides SHALL be deep-merged with the default color values so that unspecified sibling keys retain their defaults.

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
- **THEN** the result is identical to the default theme (including `text` and `colors` defaults)

#### Scenario: Override text styles

- **WHEN** `createTheme({ text: { fontFamily: "Georgia, serif" } })` is called
- **THEN** the returned theme has `text.fontFamily === "Georgia, serif"` and `text.fontSize === "16px"` (default retained)

#### Scenario: Text overrides with variants

- **WHEN** `createTheme({ text: { variants: { heading: { fontSize: { default: "32px", mobile: "24px" } } } } })` is called
- **THEN** the returned theme includes the variants alongside default base text styles

#### Scenario: Override body background color

- **WHEN** `createTheme({ colors: { background: { body: "#EAEAEA" } } })` is called
- **THEN** the returned theme has `colors.background.body === "#EAEAEA"` and `colors.background.content === "#FFFFFF"` (default retained)

#### Scenario: Override content background color

- **WHEN** `createTheme({ colors: { background: { content: "#F8F8F8" } } })` is called
- **THEN** the returned theme has `colors.background.content === "#F8F8F8"` and `colors.background.body === "#F2F2F2"` (default retained)

#### Scenario: Override both background colors

- **WHEN** `createTheme({ colors: { background: { body: "#EEE", content: "#FFF" } } })` is called
- **THEN** the returned theme has `colors.background.body === "#EEE"` and `colors.background.content === "#FFF"`

#### Scenario: Override bodyWidth

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 } })` is called
- **THEN** the returned theme has `sizes.bodyWidth === 700`

#### Scenario: Augmented breakpoint key is included in result

- **WHEN** a consumer has augmented `ThemeBreakpoints` with `tablet: ThemeBreakpoint` and calls `createTheme({ breakpoints: { tablet: createBreakpoint(540) } })`
- **THEN** the returned theme has `breakpoints.tablet.value === 540` and `breakpoints.tablet.belowMediaQuery === "@media (max-width: 539px)"`

#### Scenario: Augmented breakpoint key coexists with built-in breakpoints

- **WHEN** a consumer calls `createTheme({ breakpoints: { tablet: createBreakpoint(540) } })` without specifying `default` or `mobile`
- **THEN** `breakpoints.default` and `breakpoints.mobile` retain their default values alongside the augmented `breakpoints.tablet`
