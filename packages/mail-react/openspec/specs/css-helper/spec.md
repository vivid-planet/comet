## Requirements

### Requirement: css tagged-template literal returns the interpolated string
The `css` function SHALL be a tagged-template literal that returns the raw string with all interpolations resolved. Its purpose is to enable CSS syntax highlighting and formatting in IDE plugins (e.g. the styled-components VSCode extension) — it performs no transformation beyond standard template-literal evaluation.

#### Scenario: Static template without interpolations
- **WHEN** `css` is called with a template literal containing only static text
- **THEN** it returns that text exactly

#### Scenario: Template with interpolated values
- **WHEN** `css` is called with a template literal containing interpolated expressions
- **THEN** it returns the fully resolved string with all values in their correct positions

### Requirement: Unit test for css helper
A unit test SHALL exist at `src/utils/css.test.ts` verifying the scenarios of the `css tagged-template literal returns the interpolated string` requirement.

#### Scenario: Test covers static and interpolated templates
- **WHEN** the test suite runs
- **THEN** it verifies that `css` returns the correct string for both static templates and templates with interpolations
