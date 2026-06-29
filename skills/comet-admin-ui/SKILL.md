---
name: comet-admin-ui
description: Building or editing admin UI in a project that uses @comet/admin and its sibling packages — pages, dashboards, dialogs, widgets, layouts, or component styling. Use even for small UI changes, to build with Comet's theme, components, and helpers instead of custom sx/styled CSS, hard-coded values, or Box layouts.
---

# Building admin UIs with @comet/admin

`@comet/admin` and its sibling packages ship a design system: a theme (spacing,
colors, shadows, typography, breakpoints) and a library of ready-made components. For
internationalization, the project uses `react-intl` to translate text, numbers, and dates. The
components and types are available in the consuming project through the installed packages —
import them directly (e.g. `import { Button, MainContent } from "@comet/admin"`).

Build admin UI by composing what the design system already provides. Add custom styling only
after the system genuinely can't express what you need.

## Core principle

**Prefer Comet's theme values, components, and helpers over custom styling.** Three reasons:

1. **Reviewability.** When styling lives in the theme and in components, the markup stays
   declarative and diffs stay small. A component that mixes `sx`, inline `style`, and `styled()`
   is hard to read and hard to review — the layout, the styling, and the logic blur together.
2. **Automatic upgrades.** A project's visual design is often built against a _future_ version of
   the design system, so it won't fully match what the currently installed components and theme
   produce. That gap is expected — it is not a reason to add custom styling to force the match.
   Use the current Comet components and tokens as they are; a later library upgrade closes the gap
   on its own, with no hand-written CSS to find and rework.
3. **Consistency.** Every screen built from the same components and tokens looks and behaves the
   same way.

This holds **even when a project's design deliberately differs** from the current library
defaults: prefer the Comet component or token, and apply that project-specific difference by
configuring the theme — not by re-styling individual components. Add custom styling only when
explicitly instructed, or when no component, prop, or token can produce the result.

## Decision framework

Before writing any styling or markup, work down this list and stop at the first step that applies:

1. **Is there a component for this?** Use it rather than assembling the same thing from
   `Box` + CSS (page structure, cards, toolbars, dialogs, alerts, buttons, …).
2. **Is there a prop for this?** Props apply the correct theme values with no CSS — e.g.
   `elevation` / `square` on `Paper` and `Card`, `variant` on `Button` and `Typography`,
   `spacing` on `Stack` and `Grid`.
3. **Is there a theme value for this?** Read spacing, colors, and shadows from the theme
   (`theme.spacing(n)`, `theme.palette.*`, `theme.shadows[n]`) instead of hard-coding pixels,
   hex colors, or shadow strings.
4. **Is there a helper for this?** User-facing text, numbers, and dates go through the i18n
   helpers (`FormattedMessage`, `FormattedNumber`, `FormattedDate`), never hard-coded.
5. **Only then, custom-style** — using `styled()` (not `sx` or inline `style`) and reading
   values from the theme.
