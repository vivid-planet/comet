# @comet/mail-react

Single-package solution for building HTML emails with React and MJML. Consumers install only `@comet/mail-react` (plus `react`) — never `@faire/mjml-react` directly.

The package:

- re-exports all `@faire/mjml-react` MJML components (with prop types renamed to drop the `I` prefix);
- extends some of them with extra props and features;
- adds new components and utilities — block factories (`BlocksBlock`, `ListBlock`, `OneOfBlock`, `OptionalBlock`) for rendering Comet CMS block data, and a `css()` tagged template literal for IDE syntax highlighting.

Some components also ship in an `Html` variant for use inside MJML ending tags. These variants are additive — separate components alongside the `Mjml` versions, with their own API.

## Internal development

We extend `@faire/mjml-react` rather than fork it. A few rules keep that working:

- **Additive only.** A custom component must work everywhere the base did. Only add props — never remove or rename them, and don't require new providers or context. For theme access, prefer `useOptionalTheme()` over `useTheme()`.
- **Wrap, don't reimplement.** Custom components delegate to `@faire/mjml-react`. Less to maintain, and we stay close to upstream behaviour.
- **One export per name.** When we ship a custom version, it replaces the re-export. Consumers should never need to import from `@faire/mjml-react` directly.

### Styling

- **Inline first.** Components must render correctly without any `<style>` block — clients like Outlook ignore them.
- **Media queries** via `registerStyles` are progressive enhancement for mobile, where modern CSS (flex, grid) is fine. Use `theme.breakpoints.*.belowMediaQuery` (max-width queries) to target viewports below a breakpoint.
- **BEM, camelCase blocks.** Block `mjmlSection`, element `mjmlSection__item`, modifier `mjmlSection--indented`. Every component applies its block class and merges any consumer-provided `className` with `clsx`: `clsx("mjmlSection", className)`.

### File layout

- **Location.** Custom components live in `src/components/<concern>/` (e.g. `src/components/section/MjmlSection.tsx`).
- **File order.** Imports → types/props → component → styles. `registerStyles` calls go below the component.
- **Module format.** ESM only (`type: module`). Use `.js` extensions in imports.
- **TSDoc.** Short TSDoc — one line where possible — on exported components and props.

### Storybook

Every custom component has a story in `src/components/<concern>/__stories__/<Component>.stories.tsx`. Wrap non-section stories in `<MjmlSection indent>` to show a realistic indented layout.

### Changesets

A changeset describes what changes for the consumer. If the public API and end-user behavior are unchanged, no changeset is needed.

When a custom component replaces a re-export, describe the change against the previous re-export — the added props, features, or behavior. Consumers don't need to know the internal component is new; they only see what's different in the API they use.

## Internal documentation per feature

Features substantial enough to live in their own directory should have a `README.md` that records what the feature is, what it deliberately doesn't do, and what it depends on. These READMEs are internal — written for the people (and agents) maintaining the code, not for consumers. End-user usage docs live elsewhere (see [Consumer-facing documentation](#consumer-facing-documentation)).

### What is a feature

A feature is any self-contained unit of behavior worth describing on its own — a component (`InlineLink`), a utility (`css` helper), an addon (the Storybook addon), or the package itself. Features nest: this README documents `@comet/mail-react` as a feature, and the components inside it are features in their own right.

A feature README describes **only its own feature**. It does not describe parent features that contain it, nor sub-features it contains — each of those has its own README.

### Where they live

A feature that warrants a README is organized as a directory, with the README at the directory root (e.g. `src/components/inline-link/README.md`). Small features that live as a single file inside a parent don't need their own README — they're just part of the parent. Promote a file to a directory at the same time you give it a README.

### What goes in a feature README

**Title.** Use the exact identifier when the feature is a single component or function (e.g. `MjmlSection`); otherwise use a sentence-case name (e.g. _Inline link_).

Three sections, in order. Only the intro is required.

1. **Intro.** One short paragraph: what problem the feature solves, and what it does to solve it.
2. **Non-goals** (optional). Things the feature deliberately doesn't do, only when a reader might otherwise assume it does. Skip the obvious; skip future work; skip rejected alternatives — those belong in the commit that made the choice.
3. **Dependencies** (optional). Other features this builds on, one sentence each.

Other sections should be rare — only when content is durable, feature-specific, and doesn't fit the three above. Specifically not warranted: no Architecture (the code shows it), no Design decisions (commits carry them), no Usage (consumer docs).

**Express the rule, not the code.** Every line should say something the code doesn't. Don't restate type signatures, prop lists, formulas, or control flow — the code already shows those.

**Length.** Simple feature → one paragraph. Complex feature → one screen, no scrolling. Past a screen and you're probably duplicating commit history or describing what the code shows.

### Template

```md
# <feature-name>

<One short paragraph: what problem the feature solves, and what it does to solve it.>

## Non-goals <!-- only if any -->

- <Something the feature deliberately doesn't do, only when a reader might otherwise assume it does.>

## Dependencies <!-- only if any -->

- [<feature-name>](path/to/feature/README.md) — <what it provides>
```

### Living documents

Feature READMEs (this one included) should stay current. Update them in the same PR as any change that makes them inaccurate or adds context worth recording.

## Consumer-facing documentation

- Docs: [docs/docs/3-features-modules/13-building-html-emails/](../../docs/docs/3-features-modules/13-building-html-emails/)
- Agent skill: [skills/comet-mail-react/SKILL.md](../../skills/comet-mail-react/SKILL.md)

When a change here affects usage patterns, component APIs, or styling conventions, update these alongside the library change.
