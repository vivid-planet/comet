## MODIFIED Requirements

### Requirement: Theme type interfaces

The library SHALL export the following interfaces from its main entry point: `Theme`, `ThemeSizes`, `ThemeBreakpoints`, `ThemeBreakpoint`, `ThemeText`, `TextStyles`, `TextVariantStyles`, `TextVariants`.

`Theme` SHALL contain a `sizes` property of type `ThemeSizes`, a `breakpoints` property of type `ThemeBreakpoints`, and a `text` property of type `ThemeText`.

All interfaces SHALL support TypeScript module augmentation (declaration merging) so consumers can extend the theme at any level.

#### Scenario: Consumer imports theme interfaces

- **WHEN** a consumer writes `import type { Theme, ThemeSizes, ThemeBreakpoints, ThemeBreakpoint, ThemeText } from "@comet/mail-react"`
- **THEN** all imports resolve successfully

#### Scenario: Consumer imports text type interfaces

- **WHEN** a consumer writes `import type { TextStyles, TextVariantStyles, TextVariants } from "@comet/mail-react"`
- **THEN** all imports resolve successfully

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

### Requirement: createTheme function

The library SHALL export a `createTheme` function from its main entry point. `createTheme` SHALL accept an optional partial overrides object and return a complete `Theme`.

The overrides object SHALL accept `sizes` as a partial object (e.g. `{ sizes: { bodyWidth: 700 } }`).

The overrides object SHALL accept `breakpoints` as a partial `ThemeBreakpoints` object containing `ThemeBreakpoint` values (e.g. `{ breakpoints: { mobile: createBreakpoint(480) } }`), NOT as plain numbers. Consumers SHALL use `createBreakpoint` to construct breakpoint override values.

The overrides object SHALL accept `text` as a partial `ThemeText` object (e.g. `{ text: { fontFamily: "Georgia" } }`). Text overrides SHALL be shallow-merged with the default text values.

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
- **THEN** the result is identical to the default theme (including `text` defaults)

#### Scenario: Override text styles

- **WHEN** `createTheme({ text: { fontFamily: "Georgia, serif" } })` is called
- **THEN** the returned theme has `text.fontFamily === "Georgia, serif"` and `text.fontSize === "16px"` (default retained)

#### Scenario: Text overrides with variants

- **WHEN** `createTheme({ text: { variants: { heading: { fontSize: { default: "32px", mobile: "24px" } } } } })` is called
- **THEN** the returned theme includes the variants alongside default base text styles

#### Scenario: Override bodyWidth

- **WHEN** `createTheme({ sizes: { bodyWidth: 700 } })` is called
- **THEN** the returned theme has `sizes.bodyWidth === 700`

#### Scenario: Augmented breakpoint key coexists with built-in breakpoints

- **WHEN** a consumer calls `createTheme({ breakpoints: { tablet: createBreakpoint(540) } })` without specifying `default` or `mobile`
- **THEN** `breakpoints.default` and `breakpoints.mobile` retain their default values alongside the augmented `breakpoints.tablet`
