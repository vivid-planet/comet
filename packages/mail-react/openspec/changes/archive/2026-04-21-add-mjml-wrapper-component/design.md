## Context

`MjmlSection` currently applies `theme.colors.background.content` (default `#FFFFFF`) as its default `backgroundColor` when a theme is present. This was introduced in `add-theme-background-colors` to give the common "white card on gray body" look without per-section configuration.

MJML's layout model is a cake of nested tables: `mj-body` → optionally `mj-wrapper` → `mj-section` → `mj-column`. Each level can have its own background color, and inner backgrounds paint over outer ones. As a result, the section-level default silently defeats any background set on an `mj-wrapper` around it — making the re-exported `MjmlWrapper` effectively unusable in theme-aware templates.

The fix needs to preserve the current ergonomics for the common case (standalone sections should still look like white cards) while allowing a wrapper-owned background to show through when a wrapper is present.

## Goals / Non-Goals

**Goals:**

- Introduce a custom `MjmlWrapper` that replaces the current re-export
- Wrapper inherits the same theme-default convention that `MjmlSection` has today (bg defaults to `theme.colors.background.content`, explicit prop wins, no theme → no default)
- Sections inside a custom `MjmlWrapper` do not apply their own theme default, so the wrapper's background is visible
- Fully backwards-compatible for standalone `MjmlSection` usage (no wrapper in scope → behavior identical to today)
- Work without any `ThemeProvider` (same convention as other custom components in this package)

**Non-Goals:**

- Adding section-only features to `MjmlWrapper` (e.g., `indent`, `disableResponsiveBehavior`, `slotProps`). Start minimal; extend when a concrete need appears.
- Deep-equivalent behavior for nested wrappers. MJML does not allow `mj-wrapper` inside `mj-wrapper`; we do not design for it.
- Docs and the `comet-mail-react` skill. They will be updated out-of-scope for this change.

## Decisions

### Shadow the re-export with a custom component

`src/index.ts` currently re-exports `MjmlWrapper` / `MjmlWrapperProps` straight from `@faire/mjml-react`. We replace those exports with the custom implementation's exports, in the same pattern already used for `MjmlSection`, `MjmlText`, and `MjmlMailRoot`. The base `@faire/mjml-react` `MjmlWrapper` and its `IMjmlWrapperProps` type are not exposed to consumers.

Today's re-exported `MjmlWrapper` is functionally broken for any theme-aware template (section backgrounds paint over it), so the observable behavior for real usage is visually identical: what was "white sections inside a wrapper with no bg" becomes "no-bg sections inside a white wrapper." The rendered HTML differs, but no current test exercises this shape.

### Scoped React context to suppress the section default

We add an internal `InsideMjmlWrapperContext = React.createContext<boolean>(false)` under `src/components/wrapper/`. The custom `MjmlWrapper` wraps its children in a Provider with `value={true}`. `MjmlSection` reads this context via an internal `useIsInsideMjmlWrapper()` hook and, when `true`, skips applying its theme-default `backgroundColor`. An explicit `backgroundColor` prop on the section still wins.

The context and hook are internal: they are not exported from `src/index.ts`. Consumers do not need them and exposing them would lock in an implementation detail.

**Why literal "inside-wrapper" instead of a more abstract "background-owned-by-ancestor" flag?** YAGNI. Today there is exactly one ancestor type that owns bg — `MjmlWrapper`. Naming for that reality is honest and easy to rename later if a second bg-owning component appears.

### Wrapper applies its own theme default

When a theme is present and no explicit `backgroundColor` is provided, `MjmlWrapper` applies `theme.colors.background.content` on the underlying component. This mirrors the `MjmlSection` default and gives the wrapper the role of "the element that owns the content background color for its subtree."

**Why default at all, rather than leaving wrappers neutral?** An empty `<MjmlWrapper>` with no props should "just look right" the way an empty `<MjmlSection>` already does. If the consumer wants a transparent wrapper (so the body bg shows through), they pass `backgroundColor="transparent"`.

**Why not apply the theme default via `mj-attributes` in `MjmlMailRoot`?** `mj-attributes` defaults apply at the MJML render layer, below React. That makes them impossible to suppress via React context — the default would still fire on every `mj-section` inside a wrapper. Keeping the default in React lets us condition it on the wrapper context.

### Ruled-out alternatives

- **`mj-attributes` default** — same "paints over wrapper" problem as today; harder to opt out of (you can't pass `undefined`, only a different color).
- **`mj-class` + `cssClass` opt-in** — verbose, undoes the "no config per section" ergonomic win of the theme default.
- **`mj-style` CSS** — unreliable in Outlook; against the package's "inline-styles-first" styling model.
- **Remove the content-bg default entirely** — breaks the card-look ergonomic for every existing template.

### `MjmlAttributes` interaction (acknowledged caveat)

A consumer could bypass the context suppression by setting `<MjmlAttributes><MjmlSection backgroundColor={...} /></MjmlAttributes>` in their own `MjmlHead`: that attribute is applied at the MJML render layer, below our React code, so a wrapper in scope cannot suppress it. In practice, consumers who use a theme don't also set MJML-level attribute defaults, and consumers who use MJML-level attribute defaults typically don't use the theme. We accept this as a non-issue.

## Risks / Trade-offs

- [Minor breaking] The public `MjmlWrapper` export changes identity (from the base `@faire/mjml-react` component to the custom wrapper). Consumers who reached for it without a theme will see identical behavior; consumers who use it with a theme now see the wrapper's background actually show up — which is the intent.
- [Trade-off] Wrapper always gets a theme-default bg when theme is present. Consumers who want a transparent wrapper must set `backgroundColor="transparent"` explicitly. Acceptable in exchange for the "empty wrapper looks right" ergonomic.
