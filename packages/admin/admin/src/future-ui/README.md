# Future UI

This sub-package is an **experimental**, UI-only React component library inside `@comet/admin`, consumed as `@comet/admin/future-ui`. It is self-contained: it keeps its own directory and contains no routing, forms, data fetching, or other non-UI logic. Whether it stays a separate sub-package or later becomes part of `@comet/admin`'s own UI layer is still open; the UI-only separation holds either way.

Future UI builds from an unstyled foundation rather than evolving the existing MUI-based components; `@base-ui/react` is the chosen foundation.

## Experimental

Any export may change or be removed at any time, without deprecation notice. Every export carries the `@experimental` TSDoc tag. Changesets are not created for changes within this sub-package.

## Non-goals

- **No non-UI logic.** Forms (`final-form`, `react-hook-form`), routing (`react-router`), data fetching (Apollo), and similar concerns stay out.
- **No dependency on `@mui/material`, `@mui/system`, Emotion, or any other part of the existing `@comet/admin` styling stack.** Future UI is a fresh foundation; cross-imports reintroduce the competing system it removes.

## Folder and file names

- **Feature folders** use camelCase (`button/`, `textField/`).
- **Component file**: `<ComponentName>.tsx` (PascalCase), one per component feature.
- **Non-component code file**: `<featureName>.ts(x)` (camelCase) for utilities and hooks.
- **Styles**: `<ComponentName>.module.scss` (CSS Modules with SCSS).

## Component conventions

### Exports

- Props are exported as an interface named `<ComponentName>Props`, never a type alias.
- The resolved configuration is exported as a type named `<ComponentName>OwnerState`.
- The component is exported as `<ComponentName>`.

### TSDoc

Components and utilities are documented in TSDoc on the export itself, so the docs ship with the package, get picked up by Storybook, and stay next to the code.

Keep each comment as close as possible to what it describes: the component comment says what the component is for, while a prop's description and its `@defaultValue` go on the prop. Say what a feature does, not how (leave out the rendered element, prop forwarding, the base-ui foundation) and not why (the commit carries that); don't merely restate the name. Keep it as short as the feature allows. The shared override-API members — `className`, `slots`, `slotProps`, and the `OwnerState` type — share the wording shown below, extended only where a component needs more detail.

```tsx
/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 */
export function Button(props: ButtonProps) {
    // ...
}

/**
 * The resolved configuration that influences the component's appearance or behavior.
 */
export type ButtonOwnerState = {
    variant: "primary" | "secondary";
    disabled: boolean;
};

export interface ButtonProps {
    /**
     * Use `primary` only for the single main action on a page, dialog, etc.
     *
     * @defaultValue `"primary"`
     */
    variant?: "primary" | "secondary";
    /** Added alongside the component's own classes. */
    className?: string;
    /** Sets which element a named inner part renders as. */
    slots?: ButtonSlots;
    /** Props for each slot, merged with the slot's own props rather than replacing them. */
    slotProps?: ButtonSlotProps;
}
```

A change that makes a comment inaccurate updates it in the same change.

### Root element props

A component extends the props of its root element and passes the ones it doesn't handle itself to that element, so a consumer can set any attribute or event handler the root element accepts without us maintaining a dedicated prop for each. By default it doesn't re-declare or document them; they stay as the root element defines them. It may still re-declare one to support it as a documented feature.

### Override props

Future UI's exported components share one set of override props; each offers the ones that apply to it. The [styling contract](#styling-contract) is the primary way to style a component; these props do what it can't — place and swap inner parts, and set or vary their props.

- **`className`** — a string, merged with the contract classes, never replacing them. It is not a function: every value in `ownerState` already emits a `data-*` attribute, so an `ownerState`-dependent class would add nothing.
- **`slots`** — sets which element a named inner part renders as. The root is not a slot — it is the component's own outermost element, configured through the component's top-level props directly (`className`, event handlers, ARIA, …).
- **`slotProps`** — props for those same inner parts, as an object **or** a function of `ownerState`. Their type follows the element chosen for the slot in `slots`, and falls back to the slot's default element when `slots` is omitted. They are merged with the component's own props, so a contract class or handler is never dropped.
- **`ownerState`** — one object per component: the resolved configuration (`variant`, `disabled`, …) that influences the component's appearance or behavior; the root's `data-*` attributes are derived from it. It holds no transient interaction state (hover/press/focus).

A slot accepts any element only while the component injects nothing element-specific into it — a universal prop like `className` is fine, `href` is not. When the component injects an element-specific prop, the slot narrows to the elements that accept it — a minimum prop contract any intrinsic element or custom component can satisfy. A part limited for semantic reasons instead — a heading restricted to `h1`–`h6` — takes a fixed set of allowed elements.

### Styling contract

Every component emits a stable, predictable contract for consumer styling: a consumer writes plain CSS against it, with no React API involvement required. It is part of the public API — renaming an emitted class or `data-*` attribute is a breaking change.

The contract has two parts: **structural class names** for a component's elements, and **owner-state styling** for the resolved configuration, expressed as `data-*` attributes.

**Structural class names** identify a component's root and its parts:

- **Root** — `comet<Component>`. The outermost element of a component, camelCased. Examples: `cometButton`, `cometTextField`.
- **Parts** — `comet<Component>__<partName>`. A part is a named sub-element; the part name is camelCased. Examples: `cometButton__startIcon`, `cometTextField__label`.

**Owner-state styling** uses `data-*` attributes on the root element, following base-ui's own conversion of an owner-state object:

- **Enum state** → a single valued attribute: `data-variant="primary"`.
- **Boolean state** → presence only: `data-disabled` (absent when false).
- The attribute name is `data-` + the lowercased owner-state key. Owner-state keys are single lowercase words, so the name needs no kebab-casing.

**Emission.** These attributes cover owner-state values only; parts are class names. How a component emits them depends on its foundation: one rendered through `useRender` passes `state: ownerState` for base-ui to convert; one built on a base-ui primitive lets the primitive emit the state it owns and passes the rest inline (`data-variant={variant}`).

**Composition.** When a Future UI component is used as the root of another component, both root classes appear on the same element — a `CustomButton` rendering through `Button` produces `cometButton cometCustomButton`. Either layer is targetable.

**Authoring source.** The SCSS module's local class names match the public part names; the stylesheet's file name is the single source of a component's emitted name. The mapping:

| Source local | Emitted DOM class        |
| ------------ | ------------------------ |
| `root`       | `cometButton`            |
| `startIcon`  | `cometButton__startIcon` |

- A component with no single dominant element names no class `root`.
- Owner-state styles use attribute selectors nested under `.root` with `&` (`.root { &[data-variant="primary"] { … } }`).

## Theme

Components read their colors and metrics from CSS custom properties (`var(--comet-button-…)`, `var(--comet-color-…)`, `var(--comet-typography-…)`) with **no fallback** — an unthemed component renders visibly unstyled rather than silently drifting to a default. There is no runtime JS theme object.

### Token layers

The tokens are defined in five SCSS partials under [`theme/`](theme), composed into the provider module with `@use` and wrapped in a single `@layer comet`: `_primitives.scss` (raw values, internal), `_brand.scss`, `_responsive.scss`, `_semantic.scss`, and `_components.scss`. [`generateThemeTokens.ts`](cli/generateThemeTokens.ts) generates them, along with the prop-value types ([`theme/types.ts`](theme/types.ts)).

### Regenerating the tokens

The partials and types are generated from a design-token export, not edited manually. To update them:

1. Open the [DDS Figma design](https://www.figma.com/design/xAe7acdpccDSRCrfeOdAg3/DDS---Dextinity-Admin-UI---V-0.1).
2. Install and run the [Design Token Exporter](https://www.figma.com/community/plugin/1590704268871516927) plugin.
3. In the plugin, click **Export Tokens**, then **Download as ZIP**.
4. Extract the ZIP outside the repository. It contains a `design-tokens` directory — a `manifest.json` plus one `*.tokens.json` file per collection and mode. The export itself is not committed.
5. From the repo root, run the generator, pointing it at that directory by absolute path:

    ```bash
    pnpm --filter @comet/admin run generate-future-ui-theme-tokens /absolute/path/to/design-tokens
    ```

### Selecting a color scheme

`Theme` selects the active color scheme. It stays a pure function of its props — reading no `window`, `localStorage`, or `matchMedia` — so it renders the same on server and client; switching, OS-scheme resolution, and preventing the first-paint flash on SSR stay in consumer code.

## Known issues

- Styles are not delivered by the package build yet. The Babel build compiles no CSS Modules, so the class-name mapping applies in Storybook but not in published output.
