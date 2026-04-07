# @comet/mail-react

## 9.0.0-beta.1

### Minor Changes

- 6104af6: Add `MjmlMailRoot` component that provides the standard email skeleton (`<Mjml>`, `<MjmlHead>`, `<MjmlBody>`) with zero-padding defaults
- ea8bbe6: Add `disableResponsiveBehavior` and `slotProps` props to `MjmlSection`
- ed3b395: Add `registerStyles` for component-level responsive CSS

    Register CSS styles at module scope via `registerStyles`. Registered styles are automatically rendered as `<mj-style>` elements in `<MjmlHead>` by `MjmlMailRoot`. Styles can be static CSS strings or functions that receive the active theme.

- 5e626ca: Add `renderMailHtml` function via `/server` and `/client` sub-path exports

    The new `renderMailHtml` function handles the full React → MJML → HTML pipeline in a single call, returning `{ html, mjmlWarnings }`.
    Use `@comet/mail-react/server` in Node.js environments and `@comet/mail-react/client` in browser environments.

    **Example**

    ```ts
    // In a Node.js context (e.g. email sending service):
    import { renderMailHtml } from "@comet/mail-react/server";

    const { html, mjmlWarnings } = renderMailHtml(<MyEmail />);
    ```

    ```ts
    // In a browser context (e.g. Storybook, preview):
    import { renderMailHtml } from "@comet/mail-react/client";

    const { html, mjmlWarnings } = renderMailHtml(<MyEmail />);
    ```

- ed3b395: Add `ResponsiveValue<T>` type with `getDefaultFromResponsiveValue` and `getResponsiveOverrides` helpers

    Generic type for breakpoint-aware theme tokens. A `ResponsiveValue` is either a plain value or an object keyed by breakpoint names with a required `default`. The helpers resolve the default value for inline styles and extract per-breakpoint overrides for media queries.

    Use this when augmenting the theme with values that should vary per breakpoint, e.g. a custom `titleFontSize: ResponsiveValue`.

- ed3b395: Add `indent` prop to `MjmlSection` for content indentation

    `MjmlSection` now accepts an optional `indent` boolean prop that applies left/right padding based on `theme.sizes.contentIndentation`. The default indentation is applied as inline padding, with responsive overrides via registered media queries.

- 2e9b518: Add Storybook addon preset at `@comet/mail-react/storybook`

    Consumers add a single line to `.storybook/main.ts` to get a complete mail development setup:

    ```ts
    const config: StorybookConfig = {
        addons: ["@comet/mail-react/storybook"],
    };
    ```

    The preset auto-registers:
    - A **mail renderer decorator** that wraps stories in `<MjmlMailRoot>` and renders them to HTML
    - A **"Copy Mail HTML"** toolbar button to copy the rendered email HTML to the clipboard
    - A **"Use public image URLs"** toggle to replace image sources with public placeholder URLs (useful for testing on external services like Email on Acid)
    - An **"MJML Warnings"** panel showing validation warnings with a badge count

- 59e9904: Add theme system with `createTheme`, `ThemeProvider`, and `useTheme`

    `createTheme` produces a `Theme` with layout design tokens (`sizes.bodyWidth`, `breakpoints.default`, `breakpoints.mobile`). Pass an overrides object to customize sizes and breakpoints — breakpoint values are constructed with `createBreakpoint`. All theme interfaces support TypeScript module augmentation for project-specific extensions.

    `MjmlMailRoot` now accepts an optional `theme` prop. When provided, it sets the email body width and MJML responsive breakpoint from the theme.

## 9.0.0-beta.0

## 8.20.0

## 8.19.0

## 8.18.0

## 8.17.1

## 8.17.0

## 8.16.0

## 8.15.0

## 8.14.0

### Minor Changes

- 57a7c95: Re-export all components from `@faire/mjml-react` and remove it as a `peerDependency`

## 8.13.0

## 8.12.0

### Minor Changes

- 51a213a: Add mjml-compatible versions of the following block factories
    - `BlocksBlock`
    - `ListBlock`
    - `OneOfBlock`
    - `OptionalBlock`

- b4e0609: Make this package ESM and add peer dependencies to `react` and `@faire/mjml-react`

    Previously, this package was published as a CommonJS package and had no peer dependencies.
    Now, it is published as an ESM package and has peer dependencies to `react@18` and `@faire/mjml-react@3`.

    Though this is theoretically a breaking change, we are bumping only the minor version, as this package is completely new and has no known users yet.

## 8.11.1

## 8.11.0

### Minor Changes

- b9e0968: The new `@comet/mail-react` package provides utilities for building HTML emails with React
- b9e0968: Add the `css` helper function

    Similar to the `css` function provided by styled-components or @mui/material.
    It simply returns the string passed into it but provides CSS syntax highlighting and auto-formatting when using certain IDE plugins, e.g. the "styled-components" plugin in VSCode.
