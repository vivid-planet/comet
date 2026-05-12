## Why

The theme system has no color tokens. Consumers who want consistent background colors across their email templates must manually pass `backgroundColor` to every `MjmlBody` and `MjmlSection`. Adding background color defaults to the theme eliminates this repetition and establishes the `colors` namespace for future color tokens.

## What Changes

- Add a `colors` key to the `Theme` interface with a `background` sub-object containing `body` (default `#F2F2F2`) and `content` (default `#FFFFFF`)
- `ThemeColors` and `ThemeBackgroundColors` are named interfaces supporting module augmentation
- `MjmlMailRoot` applies `theme.colors.background.body` as the default `backgroundColor` on `MjmlBody`
- `MjmlSection` applies `theme.colors.background.content` as the default `backgroundColor` when a theme is present; an explicit `backgroundColor` prop always wins
- `createTheme` supports partial `colors` overrides with correct deep merging
- Default theme includes both color values

## Capabilities

### New Capabilities

_(none — this extends existing capabilities)_

### Modified Capabilities

- `theme-system`: Add `colors` key to `Theme` with `ThemeColors` and `ThemeBackgroundColors` interfaces; extend `createTheme` to support partial color overrides with deep merging; add color defaults to the default theme
- `mjml-mail-root`: Apply `theme.colors.background.body` as default `backgroundColor` on the inner `MjmlBody`
- `mjml-section`: Apply `theme.colors.background.content` as default `backgroundColor` when a theme is present; explicit `backgroundColor` prop takes precedence

## Impact

- `src/theme/themeTypes.ts` — new `ThemeBackgroundColors`, `ThemeColors` interfaces; extend `Theme`
- `src/theme/defaultTheme.ts` — add `colors` to default theme
- `src/theme/createTheme.ts` — add `colors` merging logic and override type
- `src/components/mailRoot/MjmlMailRoot.tsx` — pass `backgroundColor` to `MjmlBody`
- `src/components/section/MjmlSection.tsx` — apply theme background color as default
- `src/index.ts` — export new type names
