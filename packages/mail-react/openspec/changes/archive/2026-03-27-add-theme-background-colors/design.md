## Context

The theme system currently has `sizes`, `breakpoints`, and `text` — but no color tokens. Consumers who want consistent backgrounds must manually pass `backgroundColor` to every `MjmlBody` (via `MjmlMailRoot`) and `MjmlSection`. This change adds a `colors.background` namespace to the theme with sensible defaults.

`MjmlSection` already uses `useOptionalTheme()` to work without a `ThemeProvider`, so the pattern for conditionally applying theme-based defaults is established.

## Goals / Non-Goals

**Goals:**

- Add `colors` key to `Theme` with `background.body` and `background.content` defaults
- `ThemeColors` and `ThemeBackgroundColors` as named interfaces supporting module augmentation
- `MjmlMailRoot` applies body background from theme
- `MjmlSection` applies content background from theme when present, with explicit `backgroundColor` prop winning
- `createTheme` deep-merges color overrides without losing sibling keys

**Non-Goals:**

- Adding other color tokens (text, border, etc.) — this establishes the namespace; future changes can extend it
- Making `MjmlSection` background behavior work via CSS classes — this is inline-style only, consistent with the styling model

## Decisions

### Named interfaces for module augmentation

Add `ThemeBackgroundColors` and `ThemeColors` as separate named interfaces, exported from the package entry point. This follows the same pattern as `TextVariants` — empty-ish interfaces that consumers can extend via declaration merging.

```ts
export interface ThemeBackgroundColors {
    body: string;
    content: string;
}

export interface ThemeColors {
    background: ThemeBackgroundColors;
}
```

**Why named interfaces at both levels?** Consumers may want to add keys to `ThemeBackgroundColors` (e.g., `sidebar`) or to `ThemeColors` (e.g., `brand`). Named interfaces allow augmentation at each level independently.

### Deep merging in createTheme

The `colors` override type allows partial values at each nesting level:

```ts
colors?: {
    background?: Partial<ThemeBackgroundColors>;
} & Partial<Omit<ThemeColors, "background">>;
```

The merge in `createTheme` applies two levels of spreading:

```
{ ...defaultTheme.colors, ...overrides?.colors,
  background: { ...defaultTheme.colors.background, ...overrides?.colors?.background } }
```

This ensures `createTheme({ colors: { background: { body: "#EEE" } } })` keeps the default `content` value. The pattern mirrors how `breakpoints` merging already works (spread defaults, then overrides, with special handling for sub-objects).

**Why not a generic deep-merge utility?** The theme has a known, shallow structure. Explicit spreading is simpler, type-safe, and avoids runtime surprises. Each new nested key in the theme gets its own merge line — acceptable given the theme grows slowly.

### MjmlSection applies background via prop defaulting

When a theme is available, `MjmlSection` passes `backgroundColor={theme.colors.background.content}` before the spread of consumer props (`{...props}`). This means an explicit `backgroundColor` prop always wins.

When no theme is available (standalone usage), no default background is applied — preserving drop-in replacement behavior.

**Why not a CSS class approach?** The styling model is default-first with inline styles. Background color on `<mj-section>` maps directly to the `background-color` attribute in MJML, which becomes an inline style. Using a class would require `!important` and wouldn't work in clients without CSS support.

### MjmlMailRoot passes body background directly

`MjmlMailRoot` always has a theme (it creates one if not provided). It passes `backgroundColor={theme.colors.background.body}` to `MjmlBody`. Since `MjmlBody` is rendered internally (not by the consumer), there's no override concern — consumers who need a different body background set it via the theme.

## Risks / Trade-offs

- [Minor breaking] Adding `colors` as a required key on `Theme` means any consumer who manually constructs a `Theme` literal (without `createTheme`) must now include `colors`. This is intentional — a `Theme` without colors is incomplete. Mitigated by the fact that `createTheme` is the documented way to create themes.
- [Trade-off] Two-level spreading in `createTheme` adds a small amount of merge logic per nested key. Acceptable for the theme's known structure and avoids pulling in a deep-merge dependency.
