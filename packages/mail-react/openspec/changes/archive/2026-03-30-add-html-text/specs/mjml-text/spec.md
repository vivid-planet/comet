## MODIFIED Requirements

### Requirement: Responsive variant overrides via registerStyles

`MjmlText` SHALL register CSS styles via `registerStyles` that emit responsive media queries for each variant's non-default breakpoint values.

For text style properties, overrides SHALL target `.mjmlText--{variantName} > div` with `!important` to override inline styles.

For `bottomSpacing`, overrides SHALL target `.mjmlText--bottomSpacing.mjmlText--{variantName}` (compound selector) with `!important`.

Responsive overrides SHALL be grouped by breakpoint — one `@media` block per breakpoint per variant, containing all property declarations for that breakpoint.

When no variants are defined in the theme, no CSS SHALL be emitted.

The CSS generation logic SHALL use the shared `generateResponsiveTextCss` utility from `textStyles.ts`, passing component-specific selectors. The `textStyleCssProperties` mapping and `generateTextStyles` function SHALL be moved to or imported from `textStyles.ts`.

#### Scenario: Responsive variant emits media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }`
- **THEN** the registered CSS contains a media query targeting the mobile breakpoint with `font-size: 24px !important` for `.mjmlText--heading > div`

#### Scenario: Multiple properties grouped in one media query

- **WHEN** the theme defines variant `heading` with `fontSize: { default: "32px", mobile: "24px" }` and `lineHeight: { default: "40px", mobile: "30px" }`
- **THEN** the registered CSS contains a single mobile media query block for `.mjmlText--heading > div` with both `font-size` and `line-height` declarations

#### Scenario: Responsive bottomSpacing uses compound selector

- **WHEN** the theme defines variant `heading` with `bottomSpacing: { default: "24px", mobile: "16px" }`
- **THEN** the registered CSS contains a media query with `padding-bottom: 16px !important` targeting `.mjmlText--bottomSpacing.mjmlText--heading`

#### Scenario: Non-responsive variant produces no media queries

- **WHEN** the theme defines variant `body` with only plain values (e.g., `fontSize: "14px"`)
- **THEN** no media queries are emitted for the `body` variant

#### Scenario: No variants produces empty CSS

- **WHEN** the theme has no `text.variants` defined
- **THEN** `registerStyles` produces no CSS output
