## ADDED Requirements

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
