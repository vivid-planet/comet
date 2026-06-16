# Future UI

This sub-package is an **experimental**, UI-only React component library inside `@comet/admin`, consumed as `@comet/admin/future-ui`. It is self-contained: it keeps its own directory and contains no routing, forms, data fetching, or other non-UI logic. Whether it stays a separate sub-package or later becomes part of `@comet/admin`'s own UI layer is still open; the UI-only separation holds either way.

Future UI builds from an unstyled foundation rather than evolving the existing MUI-based components; `@base-ui/react` is the chosen foundation.

## Experimental

Any export may change or be removed at any time, without deprecation notice. Every export carries the `@experimental` TSDoc tag. Changesets are not created for changes within this sub-package.

## Non-goals

- **No non-UI logic.** Forms (`final-form`, `react-hook-form`), routing (`react-router`), data fetching (Apollo), and similar concerns stay out.
- **No dependency on `@mui/material`, `@mui/system`, Emotion, or any other part of the existing `@comet/admin` styling stack.** Future UI is a fresh foundation; cross-imports reintroduce the competing system it removes.

## Folder and file names

- **Feature folders** use kebab-case (`button/`, `text-field/`).
- **Component file**: `<ComponentName>.tsx` (PascalCase), one per component feature.
- **Non-component code file**: `<featureName>.ts(x)` (camelCase) for utilities and hooks.
- **Styles**: `<ComponentName>.module.scss` (CSS Modules with SCSS).

## Component conventions

### Exports

- Props are exported as an interface named `<ComponentName>Props`, never a type alias.
- The component is exported as `<ComponentName>`.

### TSDoc

A component's doc comment and its prop docs say what it does, not how — they leave out implementation details (the rendered element, prop forwarding, the base-ui foundation) and never restate the component's name, the same "express the rule, not the code" principle the READMEs follow.

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

| Source local     | Emitted DOM class        |
| ---------------- | ------------------------ |
| `root`           | `cometButton`            |
| `root--disabled` | `cometButton--disabled`  |
| `startIcon`      | `cometButton__startIcon` |

- A component with no single dominant element names no class `root`.
- Modifiers nest under `.root` with `&` (`&--disabled` → `cometButton--disabled`).

## Known issues

- Styles are not delivered by the package build yet. The Babel build compiles no CSS Modules, so the class-name mapping applies in Storybook but not in published output.

## Internal documentation

A feature may have a `README.md` for what its name, types, TSDoc, and commits can't carry — a non-obvious part of what it is, or a boundary it deliberately doesn't cross. These READMEs are internal: for the people and agents maintaining the code, not its consumers.

Information hierarchy: code is the source of truth for what is, TSDoc for what a feature does for its consumers, commits for why each step was taken, internal documentation for a feature's scope — what it is and isn't — that none of the others record.

### What is a feature

A feature is any self-contained part of the codebase worth describing on its own — a component, a utility, or the sub-package itself. Features nest: this README documents Future UI as a feature, and the components and utilities inside it are features in their own right. A feature README describes only its own feature, never the parent that contains it nor the sub-features it contains — each of those has its own README.

### Where they live

A feature that warrants a README is a directory, with the README at its root (for example, a component folder's `README.md`). A feature small enough to live as a single file inside a parent doesn't get its own README — it is part of the parent. Turn a file into a directory at the moment you give it a README.

### What goes in a feature README

**Title.** The exact identifier when the feature is a single component or function (`Button`); otherwise a sentence-case name.

Most READMEs use one or both of two sections:

1. **Intro.** The non-obvious part of what the feature is or does, in present tense.
2. **Non-goals.** What a reader would reasonably assume the feature does but it doesn't. Write each as a noun phrase, with one follow-up sentence only to point to the alternative or give the reason.

A complex feature may add sections specific to its scope, as this sub-package's own README does. Not sections of their own: Architecture (the code shows it), Design decisions (commits carry them), Usage (consumer docs), Dependencies (imports show them).

**Express the rule, not the code.** Every line says something the name and code don't — "A button component with a set of optional variants", never "The Button component".

**Length.** Keep a README as short as the feature allows — often a line of intro or a few non-goals. A genuinely complex feature may run to about a screen. Past a screen you are duplicating commit history or describing what the code shows.

### Template

```md
# <feature-name>

<Intro (optional) — the non-obvious part of what the feature is or does.>

## Non-goals <!-- only if any -->

- <Noun phrase naming what the feature deliberately doesn't do.> <Optional follow-up pointing to the alternative or stating why.>
```

### Living documents

These READMEs stay current. A change that makes one inaccurate, shifts a convention, or reverses a decision updates the affected README in the same change.
