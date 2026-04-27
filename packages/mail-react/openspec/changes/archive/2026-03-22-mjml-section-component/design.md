## Context

`@comet/mail-react` currently re-exports every `@faire/mjml-react` component verbatim. The library's roadmap calls for adding custom wrapper components that enrich the base MJML components with opinionated defaults and convenience features — all while preserving backward-compatible props.

`MjmlSection` is the first component to receive this treatment, adding responsive control and slotProps on top of the base MJML component.

## Goals / Non-Goals

**Goals:**
- Provide a drop-in `MjmlSection` that extends (not replaces) the base component's API.
- Allow disabling column stacking on mobile via `disableResponsiveBehavior` (wrapping children in `MjmlGroup`).
- Establish the `slotProps` pattern as the library-wide convention for sub-element prop forwarding.

**Non-Goals:**
- Indentation / content spacing — requires a theme system and style registry to be useful. Will be added as part of a future theme change.
- HTML variant of the section component.
- Storybook stories (will be a follow-up).

## Decisions

### 1. SlotProps pattern

The component exposes a `slotProps` object where each key corresponds to an internal element's props. For `MjmlSection`, the only slottable element is `group` (the `MjmlGroup` rendered when `disableResponsiveBehavior` is set). The type uses `Partial<MjmlGroupProps>` so consumers can pass any valid `MjmlGroup` prop.

This pattern follows MUI's convention. It will be reused across future custom components.

### 2. Export wiring

The custom `MjmlSection` component replaces the direct `@faire/mjml-react` re-export in `src/index.ts`. The `MjmlSectionProps` export name is taken over by the custom component's props type (a strict superset of the original). The base component and type are not exposed — consumers interact exclusively with `@comet/mail-react`'s version, and the custom wrapper is a transparent drop-in when no new props are used.

### 3. File location: `src/components/MjmlSection.tsx`

Custom components live in `src/components/`. This is the first file in that directory, establishing the convention for future wrappers.

## Risks / Trade-offs

- **Subtle behavior change for `MjmlSectionProps` type** — Downstream code importing `MjmlSectionProps` will now get the extended type (which is a superset). This is not a breaking change at runtime but could cause type-level surprises if someone is narrowly asserting the shape. → Mitigation: the extended type is a strict superset; no existing valid usage breaks.
