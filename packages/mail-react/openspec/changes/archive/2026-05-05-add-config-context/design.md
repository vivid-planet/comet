## Context

The package already ships a `ThemeProvider` / `useTheme` pair for visual design tokens. New block-level components in the works (starting with pixel-image blocks) need different kinds of runtime data — DAM base URLs, allowed image sizes, environment-specific identifiers — that are configuration, not design. Mixing the two in `Theme` couples concerns with very different lifetimes (design tokens are static across deployments; integration data is environment-specific). A separate, additive `Config` primitive keeps both concerns clean and lets each grow independently.

This change introduces the primitive only. It ships no domain-specific keys; the first consumer (`add-pixel-image-blocks`) declares its own `pixelImage` key alongside the components that read it.

## Goals / Non-Goals

**Goals:**
- A single, type-safe React context for runtime configuration of `@comet/mail-react` consumers.
- Extension model that mirrors the existing `TextVariants` pattern in `themeTypes.ts`: consumers add keys through TypeScript interface declaration merging without wrapping or shadowing the library's interface.
- Zero-config-by-default: templates that don't need any configuration can still mount `MjmlMailRoot` with no extra setup.
- Symmetry with `theme` so the wiring story is "pass `theme` and/or `config` to `MjmlMailRoot`", with `ConfigProvider` available for advanced cases that bypass `MjmlMailRoot`.

**Non-Goals:**
- Any specific config key. `pixelImage` and any future block-specific keys land in the proposals that introduce those blocks.
- Strict / required configuration enforcement. The hook never throws — downstream consumers can build narrower accessors that throw when their specific key is required (as `add-pixel-image-blocks` will do via an internal `usePixelImageConfig`).
- A merge / partial-override mechanism for nested `ConfigProvider`s. The provider replaces the value wholesale, like `ThemeProvider`. If layered configuration ever proves necessary, that's an additive change later.
- Default config values inside `MjmlMailRoot`. Theme has `createTheme()` because design tokens have sensible defaults; config does not.

## Decisions

### D1. Separate context from `Theme`

**Decision.** `Config` lives in its own React context, independent of `Theme`.

**Why.** Different concerns, different lifetimes. Theme is design tokens that rarely change between environments; config is environment-specific integration data. Keeping them separate means a designer can tweak colors without touching DAM URLs, and an environment switch updates config without disturbing visual tokens.

**Alternative considered.** Adding integration data into `Theme`. Rejected — pollutes the type, mixes concerns, and would require visual stories to know about DAM URLs.

### D2. `useConfig` returns `{}` when no provider, never throws

**Decision.** When no `ConfigProvider` is mounted, `useConfig()` returns an empty `Config` (`{}`). All `Config` keys are optional, so an empty object is a valid `Config`.

**Why.** Most templates won't need any configuration. Forcing every consumer to wrap their root in a provider just to render an email creates friction with no benefit. Block components that genuinely *require* a key (e.g., pixel-image blocks needing `pixelImage`) build their own narrow accessor that throws — failure stays close to the offending consumer.

**Alternative considered.** Mirror `useTheme`'s "throw if no provider" behavior. Rejected because `Theme` has design-token defaults via `createTheme()`, while `Config` has no library-shipped defaults — empty is the only sensible default. A `useOptionalConfig` was also considered and rejected as redundant: the regular hook already handles the no-provider case.

### D3. Augmentable `Config` interface (declaration merging)

**Decision.** `Config` is declared as an `interface` (not a `type`) and ships empty. Both this package's downstream changes and external consumers add keys via TypeScript interface declaration merging:

```ts
declare module "@comet/mail-react" {
    interface Config {
        myCustomThing?: { foo: string };
    }
}
```

**Why.** Mirrors the existing `TextVariants` augmentation pattern in `themeTypes.ts` — consumers already know how to extend types this way. Interface merging is the only TS mechanism that lets multiple sources contribute keys to the same name without wrapping or generic plumbing.

**Note on intent vs. `TextVariants`.** `TextVariants` uses merging to *fill in* an empty type with consumer-specific names. `Config` uses the same mechanism to *additively grow* the type with new keys. Same machinery, different intent. The interface's TSDoc documents this clearly so consumers don't have to infer it.

### D4. All keys optional

**Decision.** Every key on `Config` is optional. Consumers (or downstream blocks) provide a key only when needed.

**Why.** Required keys would force every template to fill in every block-specific config — even templates that don't render that block. Optionality keeps the cost of the primitive at zero for users who don't need it.

### D5. `MjmlMailRoot` accepts an optional `config` prop and always mounts `ConfigProvider`

**Decision.** Add `config?: Config` to `MjmlMailRoot`. The component always mounts `ConfigProvider` internally — with the supplied `config` when provided, and with `{}` when omitted.

**Why.** Mirrors how `MjmlMailRoot` already always mounts `ThemeProvider` (using `createTheme()` as the default). Removes a conditional branch in the render path and keeps the React tree shape the same for templates with or without `config`.

**Alternative considered.** Mount `ConfigProvider` only when `config` is provided, and rely on `useConfig`'s `{}` fallback otherwise. Rejected — the conditional branch is more code for no observable difference (`useConfig` returns `{}` either way), and the asymmetry with `ThemeProvider`'s always-mounted treatment was an unnecessary cost. The fallback inside `useConfig` is still required for code paths that bypass `MjmlMailRoot` entirely (raw `useConfig`, fragments, tests).

### D6. Standalone `ConfigProvider` is exported

**Decision.** Export `ConfigProvider` alongside `useConfig`. Consumers can mount it directly when bypassing `MjmlMailRoot` (e.g., partial fragments, custom roots, tests).

**Why.** Mirrors `ThemeProvider`. The `MjmlMailRoot.config` prop is the typical path; the standalone provider covers everything else.

### D7. File location: `src/config/`

**Decision.** New code lives at `src/config/ConfigProvider.tsx` (provider, hook, and the `Config` interface co-located).

**Why.** Top-level alongside `src/theme/`, mirroring the structural symmetry between these two contexts. Co-locating the interface with the provider/hook keeps a single import target for everything related to `Config`.

## Risks / Trade-offs

- *Two similar-looking augmentation patterns (`TextVariants` and `Config`) with different intents could confuse newcomers.* → TSDoc on `Config` (and on the augmentation example in the docs/skill) calls out the difference explicitly. The mechanic is identical; only the intent differs.
- *Empty default makes mistakes silent for keys that are typed-optional but practically required by a specific block.* → Mitigated downstream: each block ships its own narrow accessor that throws when its key is missing (per the `add-pixel-image-blocks` design). The library only enforces "config is optional"; correctness of any individual key belongs to its consumer.
- *Two contexts (`ThemeProvider` and `ConfigProvider`) at the root may feel redundant when both are needed.* → `MjmlMailRoot.config` + `MjmlMailRoot.theme` keeps the typical surface to a single component prop list. The standalone providers are escape hatches, not the default path.
