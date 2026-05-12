## Context

`HtmlText` currently has a `component` prop constrained to `keyof JSX.IntrinsicElements`. The name was borrowed from MUI's polymorphic component pattern, but MUI's `component` accepts the broader `ElementType` (including React components). Since `HtmlText` intentionally only supports HTML element tag names, the name creates a false expectation.

See proposal.md for the full motivation and list of changes.

## Goals / Non-Goals

**Goals:**
- Rename the prop to accurately describe what it accepts (an HTML element tag name)
- Rename the generic parameter to match the new prop name
- Update all tests, stories, and specs to reflect the new name

**Non-Goals:**
- Changing the prop's type or behavior (this is purely a rename)
- Supporting React components via this prop (that would be a different change)
- Renaming `MjmlText` props (it has no equivalent polymorphic prop)

## Decisions

### Prop name: `element` over `as`

**Decision:** Rename `component` to `element`.

**Alternatives considered:**
- `as`: The most common polymorphic prop name (Chakra, styled-components, Emotion). However, `as` conventionally accepts both HTML elements and React components — it would trade one false expectation for another.
- `element`: Less conventional but honest — it says exactly what it accepts. Since `HtmlText` is not truly polymorphic (no component support), avoiding a polymorphic naming pattern is a feature.

### Generic parameter: `E` over `C`

**Decision:** Rename the generic from `C` to `E` to match `element`. Single-letter generics are the existing convention in this codebase.

### Internal implementation prop name

**Decision:** The `HtmlTextImplementationProps` interface and the destructured variable in the function body both rename from `component` to `element`. The local variable used for JSX rendering (`Component`) becomes `Element` — capitalised per React's convention for component references in JSX.

## Risks / Trade-offs

- **No breaking change**: The `component` prop was introduced in an unmerged PR, so no consumers are affected. The existing changeset (`.changeset/add-html-text-component.md`) just needs to reference `element` instead of `component`.
- **Low risk**: The rename is mechanical and fully covered by TypeScript.
