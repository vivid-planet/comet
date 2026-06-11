# Future UI

This sub-package is an **experimental**, UI-only React component library inside `@comet/admin`, consumed as `@comet/admin/future-ui`. It is self-contained: it keeps its own directory and contains no routing, forms, data fetching, or other non-UI logic. Whether it stays a separate sub-package or later becomes part of `@comet/admin`'s own UI layer is still open; the UI-only separation holds either way.

Future UI builds from an unstyled foundation rather than evolving the existing MUI-based components; `@base-ui/react` is the chosen foundation.

## Experimental

Any export may change or be removed at any time, without deprecation notice. Changesets are not created for changes within this sub-package.

## Non-goals

- **No non-UI logic.** Forms (`final-form`, `react-hook-form`), routing (`react-router`), data fetching (Apollo), and similar concerns stay out.
- **No dependency on `@mui/material`, `@mui/system`, Emotion, or any other part of the existing `@comet/admin` styling stack.** Future UI is a fresh foundation; cross-imports reintroduce the competing system it removes.

## Internal documentation

A feature substantial enough to live in its own directory may have a `README.md` describing what it is and how it behaves — and, when a reader would assume otherwise, the boundaries it deliberately doesn't cross. These READMEs are internal: written for the people and agents maintaining the code, not for consumers.

Information hierarchy: code is the source of truth for what is, commits for why each step was taken, internal documentation for what a feature is and what it isn't.

### What is a feature

A feature is any self-contained part of the codebase worth describing on its own — a component, a utility, or the sub-package itself. Features nest: this README documents Future UI as a feature, and the components and utilities inside it are features in their own right. A feature README describes only its own feature, never the parent that contains it nor the sub-features it contains — each of those has its own README.

### Where they live

A feature that warrants a README is a directory, with the README at its root (for example, a component folder's `README.md`). A feature small enough to live as a single file inside a parent doesn't get its own README — it is part of the parent. Turn a file into a directory at the moment you give it a README.

### What goes in a feature README

**Title.** The exact identifier when the feature is a single component or function (`Button`); otherwise a sentence-case name.

Two sections, in order; only the intro is required.

1. **Intro.** State, in neutral present tense, what the feature is or does. Include a non-obvious behavior or constraint when it is part of what the feature is; keep out the motivation and the prior state — the why lives in the commit. The test: describe how it behaves, not why it exists.
2. **Non-goals** (optional). Only what a reader would reasonably assume the feature does but it doesn't; the test is whether they would look here for it and be surprised it is missing. Write each as a noun phrase, with one follow-up sentence only to point to the alternative or give the reason.

The two sections above are all a README normally carries. A custom section is allowed but is the exception — add one only when explicitly required, and only for durable, feature-specific content that genuinely fits neither section above. Not custom sections: Architecture (the code shows it), Design decisions (commits carry them), Usage (consumer docs), Dependencies (imports show them).

**Express the rule, not the code.** Every line says something the code doesn't. The feature's name is on its folder and export too, so the intro adds something beyond it rather than restating it: "A button component with a set of optional variants", never "The Button component".

**Length.** Keep it as short as the feature allows. Most features need nothing beyond the one-sentence intro; a genuinely complex feature — this sub-package's own README, for one — may run longer when it warrants it, up to about a screen. Past a screen you are duplicating commit history or describing what the code shows.

### Template

```md
# <feature-name>

<One sentence: what the feature is or does.>

## Non-goals <!-- only if any -->

- <Noun phrase naming what the feature deliberately doesn't do.> <Optional follow-up pointing to the alternative or stating why.>
```

### Living documents

These READMEs stay current. A change that makes one inaccurate, shifts a convention, or reverses a decision updates the affected README in the same change.
