## Why

`MjmlSection` currently applies `theme.colors.background.content` as its default `backgroundColor` when a theme is present. This gives the common "white card on gray body" look for free, but it makes the re-exported `MjmlWrapper` effectively unusable: a wrapper with its own `backgroundColor` is always painted over by the section bg inside it. MJML's `mj-wrapper` exists specifically to share a background across multiple sections, and we need that capability to work.

## What Changes

- Add a custom `MjmlWrapper` component under `src/components/wrapper/` that replaces the current re-export from `@faire/mjml-react`
- Custom `MjmlWrapper` applies `theme.colors.background.content` as its default `backgroundColor` when a theme is present; an explicit `backgroundColor` prop always wins; no theme → no default
- Custom `MjmlWrapper` provides an internal React context marking its subtree as "inside a wrapper"
- `MjmlSection` SHALL NOT apply the theme content-background default when it is inside a custom `MjmlWrapper` (i.e., the wrapper owns the background); an explicit `backgroundColor` prop on `MjmlSection` still wins
- Export `MjmlWrapperProps` type from the package entry point (shadowing the current re-exported type)
- The base `@faire/mjml-react` `MjmlWrapper` component and its `IMjmlWrapperProps` type SHALL NOT be exposed to consumers

## Capabilities

### New Capabilities

- `mjml-wrapper`: custom wrapper component that groups sections with a shared background, integrates with the theme, and suppresses the per-section background default inside its subtree

### Modified Capabilities

- `mjml-section`: add "no theme background default when inside a custom `MjmlWrapper`" behavior to the existing default-background requirement

## Impact

- `src/components/wrapper/MjmlWrapper.tsx` — new custom component
- `src/components/wrapper/InsideMjmlWrapperContext.ts` — new internal context and `useIsInsideMjmlWrapper()` hook (not exported from the package)
- `src/components/section/MjmlSection.tsx` — consult `useIsInsideMjmlWrapper()` when deciding whether to apply the theme default
- `src/index.ts` — replace the `MjmlWrapper` / `MjmlWrapperProps` re-export with the custom version's exports
- `src/components/wrapper/__stories__/MjmlWrapper.stories.tsx` — new Storybook story
- Two new changeset files under `.changeset/`:
    - `minor` — `MjmlWrapper` now applies the theme's background color by default
    - `patch` — fix `MjmlSection` overriding `MjmlWrapper`'s background
