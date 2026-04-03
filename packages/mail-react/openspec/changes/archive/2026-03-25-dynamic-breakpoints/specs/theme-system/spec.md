## ADDED Requirements

### Requirement: createBreakpoint is exported

The library SHALL export a `createBreakpoint` function from its main entry point. `createBreakpoint` SHALL accept a `value` parameter of type `number` and return a `ThemeBreakpoint` with the corresponding `value` and `belowMediaQuery`.

#### Scenario: Consumer imports createBreakpoint

- **WHEN** a consumer writes `import { createBreakpoint } from "@comet/mail-react"`
- **THEN** the import resolves successfully

#### Scenario: createBreakpoint produces a ThemeBreakpoint

- **WHEN** `createBreakpoint(540)` is called
- **THEN** it returns `{ value: 540, belowMediaQuery: "@media (max-width: 539px)" }`

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: createBreakpoint is not exported

**Reason**: `createBreakpoint` is now a public API export, required by consumers to construct `ThemeBreakpoint` values for `createTheme` breakpoint overrides and for module-augmented custom breakpoints.

**Migration**: Consumers who were not using `createBreakpoint` (it was internal) are unaffected. The function is now available via `import { createBreakpoint } from "@comet/mail-react"`.
