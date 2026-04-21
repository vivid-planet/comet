---
description: Language-agnostic naming, control-flow, and comment rules
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.mjs,**/*.cjs"
paths:
    - "**/*.{ts,tsx,js,jsx,mjs,cjs}"
globs:
    - "**/*.{ts,tsx,js,jsx,mjs,cjs}"
alwaysApply: false
---

# General Rules (all languages)

## Naming

- Use descriptive names. A reader should understand intent without reading the implementation or a comment.
- Prefer descriptive identifiers over explanatory comments — comments drift out of sync with the code.
- Boolean variables must read as booleans: prefix with `is` / `has` / `should` (exceptions: well-known flags like `loading`, `disabled`).
- Name booleans in the **affirmative**: `isComplete`, not `isNotComplete`. Negate at the use site with `!`.
- Do **not** use abbreviations. Exceptions: widely-known protocols/acronyms (HTML, CSS, TCP, API, SSO…) and names dictated by third parties.
- When an acronym appears in PascalCase / camelCase, treat it like a word: `GuiController`, `UiElement` — not `GUIController` / `UIElement`.

## Control flow

- **Never use exceptions for control flow.** Exceptions signal _exceptional_ situations; using them for expected branches hides real failures. Check preconditions explicitly (`if (!(await exists(id))) return undefined;`) instead of wrapping a `findOrFail` in try/catch.

## Comments

- Default to writing no comments. Only add a comment when the _why_ is non-obvious (hidden constraint, workaround, surprising invariant).
- Never write comments that restate _what_ the code does — the names should do that.
- Never reference the current task, ticket, or PR in comments — that context belongs in the PR description and rots in code.
