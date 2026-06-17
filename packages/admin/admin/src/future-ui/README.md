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
- The component is exported as `<ComponentName>`.

### TSDoc

Components and utilities are documented in TSDoc on the export itself, so the docs ship with the package, get picked up by Storybook, and stay next to the code.

Keep each comment as close as possible to what it describes: the component comment says what the component is for, while a prop's description and its `@defaultValue` go on the prop. Say what a feature does, not how (leave out the rendered element, prop forwarding, the base-ui foundation) and not why (the commit carries that); don't merely restate the name. Keep it as short as the feature allows.

```tsx
/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 */
export function Button(props: ButtonProps) {
    // ...
}

export interface ButtonProps {
    /**
     * Use `primary` only for the single main action on a page, dialog, etc.
     *
     * @defaultValue `"primary"`
     */
    variant?: "primary" | "secondary";
}
```

A change that makes a comment inaccurate updates it in the same change.

### Root element props

- A component extends the props of its root element and forwards the ones it doesn't handle itself to that element, so a consumer can set any attribute or event handler the root element accepts without a dedicated prop for each.
- A consumer-set `className` is merged with the contract classes, never replacing them.

### Class-name contract

Every component emits a stable, predictable set of class names. These class names are part of the public API — renaming an emitted class is a breaking change. They are the primary path for consumer styling: a consumer writes plain CSS against them, with no React API involvement required.

**The emitted shape:**

- **Root** — `comet<Component>`. The outermost element of a component, camelCased. Examples: `cometButton`, `cometTextField`.
- **Parts** — `comet<Component>__<partName>`. A part is a named sub-element; the part name is camelCased. Examples: `cometButton__startIcon`, `cometTextField__label`.
- **Modifiers, on the root only** — `comet<Component>--<propName><Value>` for enum props (camelCase value: `cometButton--variantPrimary`), `comet<Component>--<propName>` for booleans (`cometButton--disabled`).

Future UI's styling contract is its class names. Components built on `@base-ui/react` also emit base-ui's `data-*` attributes (`[data-disabled]`, …); these are base-ui's contract passed through, not one Future UI maintains — style against the class names.

**Composition.** When a Future UI component is used as the root of another component, both root classes appear on the same element — a `CustomButton` rendering through `Button` produces `cometButton cometCustomButton`. Either layer is targetable.

**Authoring source.** The SCSS module's local class names match the public part names; the stylesheet's file name is the single source of a component's emitted name. The mapping:

| Source local           | Emitted DOM class             |
| ---------------------- | ----------------------------- |
| `root`                 | `cometButton`                 |
| `root--variantPrimary` | `cometButton--variantPrimary` |
| `root--disabled`       | `cometButton--disabled`       |
| `startIcon`            | `cometButton__startIcon`      |

- A component with no single dominant element names no class `root`.
- Modifiers nest under `.root` with `&` (`&--disabled` → `cometButton--disabled`).

## Known issues

- Styles are not delivered by the package build yet. The Babel build compiles no CSS Modules, so the class-name mapping applies in Storybook but not in published output.
