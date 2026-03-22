## Why

The library currently re-exports `MjmlSection` directly from `@faire/mjml-react` without any enhancements. Downstream projects need common section-level features — responsive behavior control and sub-element customization — and are forced to reimplement these individually. A first-party `MjmlSection` wrapper in `@comet/mail-react` provides these features out of the box while preserving full compatibility with the underlying MJML component.

## What Changes

- **New custom `MjmlSection` component** (`src/components/MjmlSection.tsx`) wrapping `@faire/mjml-react`'s `MjmlSection` with:
  - `disableResponsiveBehavior` prop — wraps children in `MjmlGroup` to prevent columns from stacking on mobile.
  - `slotProps` — allows passing props to internal sub-elements (currently: `group`).
- **Updated `src/index.ts`** — the custom `MjmlSection` replaces the direct re-export. The custom props type takes over the `MjmlSectionProps` export name.
- **SlotProps pattern** established as a library-wide convention for component sub-element customization.

## Capabilities

### New Capabilities
- `mjml-section`: Custom `MjmlSection` component with responsive behavior control and slotProps support.

### Modified Capabilities

_(none — no existing specs)_

## Impact

- **Exports**: `MjmlSection` and `MjmlSectionProps` exports change from plain re-exports to the custom component and its props type (a strict superset of the original). Existing call sites remain compatible.
- **New file**: `src/components/MjmlSection.tsx`
- **Modified file**: `src/index.ts` (export wiring)
- **Dependencies**: No new runtime dependencies.
- **Changeset**: Required — this adds new public API surface.
