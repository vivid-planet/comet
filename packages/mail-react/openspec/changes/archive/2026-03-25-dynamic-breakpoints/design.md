## Context

The theme system (designed in the archived `add-theme-system` change) specifies that `ThemeBreakpoints` is an interface supporting module augmentation. Consumers can add custom breakpoints like `tablet`:

```ts
declare module "@comet/mail-react" {
    interface ThemeBreakpoints {
        tablet: ThemeBreakpoint;
    }
}
```

The original `createTheme` design accepted breakpoints as plain numbers (`{ breakpoints: { mobile: 480 } }`) and hardcoded exactly two keys (`default`, `mobile`) in the return object. This means any augmented breakpoint key is silently dropped at runtime despite being accepted by the type system.

The theme system is implemented on this branch. This change corrects the breakpoint handling approach.

## Goals / Non-Goals

**Goals:**

- Make `createTheme` handle arbitrary breakpoint keys dynamically, so augmented keys flow through to the output.
- Export `createBreakpoint` as a public API so consumers can construct `ThemeBreakpoint` values for overrides.
- Change breakpoint overrides from plain numbers to `ThemeBreakpoint` objects, eliminating the need for an internal conversion loop.
- Preserve the auto-derivation of `breakpoints.default` from `sizes.bodyWidth`.
- Ensure `default` and `mobile` are always present in the result, even when not included in overrides.

**Non-Goals:**

- Changing the `ThemeBreakpoint` shape (`value` + `belowMediaQuery`).
- Adding default values for augmented breakpoints (consumers must supply them explicitly).
- Runtime validation beyond what TypeScript enforces.

## Decisions

### 1. Export `createBreakpoint` as a public API

Consumers who augment `ThemeBreakpoints` already interact with the `ThemeBreakpoint` interface in their type declarations. Requiring them to use `createBreakpoint` to construct override values is consistent — they're already in "power user" territory. Exporting it also prevents consumers from manually constructing `{ value, belowMediaQuery }` objects and getting the media query format wrong.

**Alternative considered:** Keep `createBreakpoint` internal and accept plain numbers. Rejected because it requires a dynamic loop with runtime `typeof` checks and produces a `Record<string, ThemeBreakpoint>` that needs type coercion to satisfy `ThemeBreakpoints`.

### 2. Breakpoint overrides accept `ThemeBreakpoint` objects, not numbers

The overrides type changes from `Partial<Record<keyof ThemeBreakpoints, number>>` to `Partial<ThemeBreakpoints>`. The input shape now matches the output shape — no conversion step needed. This makes the merge logic a simple spread chain:

```ts
breakpoints: {
    ...defaultTheme.breakpoints,                         // base: default + mobile
    default: createBreakpoint(resolvedSizes.bodyWidth),  // auto-derive default
    ...overrides?.breakpoints,                           // overlay all overrides (including augmented keys)
}
```

No dynamic loop, no runtime type checks, no type gymnastics. Augmented keys in overrides flow through the spread naturally. The `ThemeBreakpoints` type is satisfied because the object starts from `defaultTheme.breakpoints`.

**Alternative considered:** Accept both numbers and `ThemeBreakpoint` objects via a union type. Rejected because it adds a runtime `typeof` check per entry and makes the override type harder to understand.

### 3. `createBreakpoint` signature and location stay the same

The function already exists at `src/theme/createBreakpoint.ts` with a clean signature: `(value: number) => ThemeBreakpoint`. The only change is adding a re-export from `src/index.ts`. A TSDoc comment should be added since it becomes part of the public API.

### 4. `CreateThemeOverrides` type update

```ts
type CreateThemeOverrides = {
    sizes?: Partial<ThemeSizes>;
    breakpoints?: Partial<ThemeBreakpoints>;
};
```

`Partial<ThemeBreakpoints>` naturally picks up augmented keys, since `ThemeBreakpoints` is an interface.

## Risks / Trade-offs

- **Slightly more verbose consumer API** — `createBreakpoint(480)` instead of just `480`. Mitigated by the clear intent it communicates and the correctness it guarantees (media query format is always right).

- **Breaking change from the original design** — The archived `add-theme-system` spec defined breakpoints as numbers. Since the theme system hasn't been merged yet, there's no actual breaking change for consumers, but the spec needs updating to reflect the new shape.

- **Standard augmentation trade-off persists** — If a consumer augments `ThemeBreakpoints` with a required key like `tablet` but calls `createTheme({})` without providing it, TypeScript won't catch the missing key (it's the same trade-off as MUI's theme augmentation). The returned object will be missing `tablet` at runtime. This is documented and accepted.
