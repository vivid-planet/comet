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

## Living document

If a change reverses a decision or shifts a convention recorded here, update this README in the same PR.

## Consumer-facing companions

- Docs: [docs/docs/3-features-modules/13-building-html-emails/](../../docs/docs/3-features-modules/13-building-html-emails/)
- Agent skill: [skills/comet-mail-react/SKILL.md](../../skills/comet-mail-react/SKILL.md)

When a change here affects usage patterns, component APIs, or styling conventions, update these alongside the library change.
