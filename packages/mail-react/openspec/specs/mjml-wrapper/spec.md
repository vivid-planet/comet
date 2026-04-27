# mjml-wrapper Specification

## Purpose

Custom `MjmlWrapper` component that wraps `@faire/mjml-react`'s `MjmlWrapper` with theme-aware background handling and a context signal so descendant `MjmlSection`s suppress their own background default, making the wrapper's background visible edge-to-edge.

## Requirements

### Requirement: Drop-in replacement for base MjmlWrapper

The custom `MjmlWrapper` component SHALL accept all props that the `@faire/mjml-react` `MjmlWrapper` accepts and forward them to the underlying component. Existing call sites that use `MjmlWrapper` without relying on the theme-based default SHALL produce identical output. The component SHALL NOT require a `ThemeProvider` ancestor.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlWrapper backgroundColor="#fff" padding="10px">` without a `ThemeProvider`
- **THEN** the underlying `@faire/mjml-react` `MjmlWrapper` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: Works without ThemeProvider

- **WHEN** `MjmlWrapper` is rendered without any `ThemeProvider` or `MjmlMailRoot` ancestor
- **THEN** the component renders successfully without throwing an error and without any default `backgroundColor`

### Requirement: Theme-based default background

When a `ThemeProvider` ancestor is present and no explicit `backgroundColor` prop is provided, `MjmlWrapper` SHALL apply `theme.colors.background.content` as the default `backgroundColor` on the underlying component.

When an explicit `backgroundColor` prop is provided, it SHALL always take precedence over the theme default.

#### Scenario: Theme background applied when theme is present

- **WHEN** `MjmlWrapper` is rendered inside a `MjmlMailRoot` without an explicit `backgroundColor` prop
- **THEN** the underlying component receives `backgroundColor` equal to `theme.colors.background.content`

#### Scenario: Explicit backgroundColor overrides theme default

- **WHEN** `MjmlWrapper` is rendered inside a `ThemeProvider` with `backgroundColor="#FF0000"`
- **THEN** the underlying component receives `backgroundColor="#FF0000"`

#### Scenario: Transparent background opt-out

- **WHEN** `MjmlWrapper` is rendered inside a `ThemeProvider` with `backgroundColor="transparent"`
- **THEN** the underlying component receives `backgroundColor="transparent"` and the body background is visible through the wrapper

### Requirement: Marks subtree as inside wrapper

`MjmlWrapper` SHALL provide a React context value to its descendants indicating that they are inside a wrapper subtree. The context and its accessor hook SHALL be internal — they MUST NOT be exported from the package entry point.

Consumers of the context (e.g., `MjmlSection`) use this signal to suppress their own default `backgroundColor`, so the wrapper's background is visible.

#### Scenario: MjmlSection inside wrapper suppresses theme default

- **WHEN** a custom `MjmlSection` without an explicit `backgroundColor` is rendered inside a custom `MjmlWrapper` inside a `MjmlMailRoot`
- **THEN** the underlying `MjmlSection` receives no `backgroundColor` and the wrapper's background is visible through the section

#### Scenario: MjmlSection outside any wrapper still gets theme default

- **WHEN** a custom `MjmlSection` without an explicit `backgroundColor` is rendered inside a `MjmlMailRoot` but NOT inside a `MjmlWrapper`
- **THEN** the underlying `MjmlSection` receives `backgroundColor` equal to `theme.colors.background.content`

### Requirement: Full-width background renders edge-to-edge

When `MjmlWrapper` is rendered with `fullWidth="full-width"` inside a `MjmlMailRoot` and its bg resolves to a color (via theme default or explicit prop), the rendered email SHALL show that background extending the full viewport width, and descendant `MjmlSection`s without explicit `backgroundColor` SHALL NOT paint over it.

#### Scenario: Full-width wrapper with sections inside

- **WHEN** `<MjmlWrapper fullWidth="full-width" backgroundColor="#FF0000">` is rendered inside a `MjmlMailRoot` with a default-theme `MjmlSection` inside it
- **THEN** the rendered HTML contains the wrapper's red background at full viewport width and the section does not apply its own background

### Requirement: Props type exported

The component's props type SHALL be exported as `MjmlWrapperProps` from the package entry point, replacing the previous re-export of `@faire/mjml-react`'s type. The base `@faire/mjml-react` `MjmlWrapper` component and its `IMjmlWrapperProps` type SHALL NOT be exposed — consumers only interact with the custom version.

#### Scenario: Custom props type importable

- **WHEN** a consumer writes `import { type MjmlWrapperProps, MjmlWrapper } from "@comet/mail-react"`
- **THEN** the imported `MjmlWrapper` is the custom component and `MjmlWrapperProps` matches its props
