## Context

The library already has `renderMailHtml` in both client and server variants, and a minimal internal Storybook decorator. This change adds a set of reusable Storybook utilities — addons and a rendering decorator — that consumers can import to get a complete mail development experience with low effort.

Storybook's architecture has two separate JavaScript contexts — the **manager** (main chrome/UI) and the **preview** (story iframe) — which communicate via a channel. This is a hard architectural constraint: manager code can only import from `storybook/manager-api`, preview code from `storybook/preview-api`. They cannot share a single entry point.

## Goals / Non-Goals

**Goals:**

- Ship reusable Storybook addons and a mail rendering decorator that consumers import with low boilerplate
- Keep the consumer setup to a few lines: a `registerMailStorybookAddons()` call in `manager.tsx` and a `MailRendererDecorator` import in `preview.tsx`
- Make all addon communication internal — consumers never handle channel events or global IDs

**Non-Goals:**

- Customizable MJML wrapping (e.g., per-consumer theme providers) — the decorator wraps in a plain `MjmlMailRoot` for now; theme/config support is a future concern when `MjmlMailRoot` gains those props
- Shipping a CSS override for Storybook padding — this is a consumer-level concern
- Providing a Storybook preset or `main.ts` configuration helper — consumers write their own `main.ts`

## Decisions

### Two flat sub-path exports: `storybook-manager` and `storybook-preview`

A single export would fail because Storybook's manager and preview bundles cannot resolve each other's APIs. Including storybook code in the main `@comet/mail-react` export would force every consumer (including server-side code) to have Storybook installed.

The exports use flat paths (`storybook-manager`, `storybook-preview`) rather than nested (`storybook/manager`, `storybook/preview`). This is consistent with the existing flat pattern (`client`, `server`) and avoids implying a parent `storybook` export exists.

**Alternative considered:** Single `@comet/mail-react/storybook` export — rejected because a barrel that imports both `storybook/manager-api` and `storybook/preview-api` fails at runtime in both contexts.

**Alternative considered:** Nested paths `storybook/manager` and `storybook/preview` — rejected because nested paths suggest a parent `@comet/mail-react/storybook` export that doesn't exist, and flat paths are consistent with the existing `client` and `server` exports.

### Explicit `registerMailStorybookAddons()` function call

The `storybook-manager` export provides a `registerMailStorybookAddons()` function that consumers call in their `manager.tsx`. This is explicit and discoverable via IDE autocomplete.

All three addons are always registered together. There is no opt-out for individual addons — this avoids API surface for something that has no real use case.

**Alternative considered:** Side-effect import (`import "@comet/mail-react/storybook-manager"`) — rejected because side-effect imports are opaque, hard to discover without docs, and don't signal intent. An explicit function call is clearer and leaves room for a future options parameter if needed.

### Pre-built decorator (not a factory)

The `MailRendererDecorator` is a ready-to-use Storybook `Decorator`. It wraps the story in `<MjmlMailRoot>`, calls `renderMailHtml`, handles the public URL toggle, emits render results, and displays the HTML.

When `MjmlMailRoot` gains theme/config props in the future, the decorator can read them from `context.args` / `context.parameters` without changing its export API.

**Alternative considered:** Factory function `createMailRendererDecorator({ renderToMjmlTree })` — rejected in favor of simplicity. A factory is warranted only when consumers need to customize the MJML tree wrapping, which is not needed today.

### Single channel event for render results

The decorator emits one event (`comet-mail-render-result`) carrying `{ html, mjmlWarnings }`. Both the copy-HTML button and the MJML warnings panel subscribe to the same event and extract what they need. The event ID is a hardcoded string literal defined identically in manager and preview source files — no shared import needed.

**Alternative considered:** Separate events per addon (one for HTML, one for warnings) — rejected because a single event is simpler, atomic, and ensures both addons stay in sync.

### Info emoji instead of `@storybook/icons`

The `UsePublicImageUrlsToggle` uses the ℹ️ emoji instead of importing `InfoIcon` from `@storybook/icons`. This avoids an additional peer dependency and keeps the component self-contained.

### `storybook` as optional peer dependency

The `storybook` package is added as an optional `peerDependency`. This signals that the storybook exports require Storybook to be installed without making it mandatory for consumers who only use the core mail components.

### Source files live in `src/storybook-manager/` and `src/storybook-preview/`

The storybook utilities are regular TypeScript source files under `src/storybook-manager/` and `src/storybook-preview/`. They are compiled by `tsc` alongside everything else and output to `lib/storybook-manager/` and `lib/storybook-preview/`. The `exports` map points to the compiled output.

## Risks / Trade-offs

- **Storybook version coupling**: The addons use `storybook/manager-api`, `storybook/preview-api`, and `storybook/internal/components` — all Storybook 8+ APIs. If Storybook's internal component API changes, our addons break. → Mitigation: pin `storybook` peer dependency range; the components used (`Button`, `AddonPanel`, `Badge`, `WithTooltip`, `TooltipNote`) are stable public components.
- **No tree-shaking of storybook source**: TypeScript compiles the storybook source files into `lib/` even though most consumers won't use them. → Acceptable: the files are tiny and the `exports` map prevents accidental imports.
