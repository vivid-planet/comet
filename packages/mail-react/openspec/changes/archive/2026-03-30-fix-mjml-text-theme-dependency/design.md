## Context

`MjmlText` wraps `@faire/mjml-react`'s `MjmlText` and adds theme-dependent features (base styles, variants, `bottomSpacing`). It currently calls `useTheme()` unconditionally on every render, which throws outside a `ThemeProvider`. This makes it impossible to use as a drop-in replacement — breaking the same "additive only" rule that was already fixed in `MjmlSection` (PR #5387).

The `MjmlSection` fix introduced `useOptionalTheme()` — an internal hook that returns `Theme | null` — and deferred the theme requirement to only when `indent` is actually used. `MjmlText` needs the same treatment, but its relationship to the theme is more pervasive: base styles, variant resolution, and `bottomSpacing` all depend on it.

## Goals / Non-Goals

**Goals:**

- `MjmlText` works without `ThemeProvider` when no theme-dependent features are used
- Clear, targeted errors when `variant` or `bottomSpacing` is used without a theme
- No public API changes
- Consistent pattern with the `MjmlSection` fix

**Non-Goals:**

- Making base styles available without a theme (they come from the theme by definition)
- Changing the `generateTextStyles` function (it already receives `Theme` as a parameter, not from a hook)

## Decisions

### Use `useOptionalTheme` and branch on `null`

Switch from `useTheme()` to `useOptionalTheme()`. When the theme is `null`:

- Skip base style resolution entirely — pass no theme-derived props to `BaseMjmlText`
- Still apply the `mjmlText` block class and merge consumer `className`
- Forward all explicit props (`fontFamily`, `fontSize`, etc.) untouched

**Why this approach?** It follows the exact pattern established by `MjmlSection`: the component degrades gracefully to a pass-through wrapper when no theme is present. Consumers who don't use themes get a component that behaves identically to the base `@faire/mjml-react` component.

**Alternative considered: always require a theme.** This would mean `MjmlText` is fundamentally different from `MjmlSection` and other wrapper components. Rejected because it violates the "additive only" principle — the theme system should enhance, not gatekeep.

### Throw targeted errors for theme-dependent props without a theme

When `theme === null` and the consumer passes `variant` or `bottomSpacing`, throw an error with a message like: "The `variant` prop requires a ThemeProvider or MjmlMailRoot." This is more actionable than the generic `useTheme` error and tells the consumer exactly which prop triggered the requirement.

The `defaultVariant` case does not need special handling — when there's no theme, there's no `defaultVariant` to read, so the component simply renders without any variant.

### Extract themed rendering into a helper function

To keep the component function clean, extract the theme-dependent prop resolution into a helper function (similar to `getIndentProps` in `MjmlSection`). This function receives `Theme | null`, `variantProp`, and `bottomSpacing`, and returns the resolved props for `BaseMjmlText`.

When theme is `null` and no theme-dependent props are used, the helper returns an empty object.

## Risks / Trade-offs

- [Behavioral change] Consumers using `MjmlText` without a `ThemeProvider` currently get an immediate error. After this change, they get a working but unstyled component. This is the intended improvement, not a regression — but it's worth noting for changelog purposes.
- [Minimal risk] The `generateTextStyles` function is unaffected — it receives `Theme` as a parameter from `registerStyles`, not from a hook. No changes needed there.
