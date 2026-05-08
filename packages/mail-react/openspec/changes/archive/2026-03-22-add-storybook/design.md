## Context

`@comet/mail-react` is an ESM-only library in the vivid-planet/comet monorepo. It re-exports and wraps `@faire/mjml-react` components for building HTML emails with React. There is currently no way to visually preview components during development.

The monorepo has existing Storybook setups (v9, webpack5) for admin packages. These are deployed and cross-referenced. This storybook is intentionally separate — local-only, not connected, and using a different framework (Vite).

## Goals / Non-Goals

**Goals:**

- Local Storybook for developing and previewing MJML components as rendered HTML
- A decorator that handles the MJML-to-HTML rendering pipeline for all stories
- Minimal, extensible setup that can grow with the library

**Non-Goals:**

- Deployment or CI builds of the storybook
- Integration with existing monorepo storybooks (refs, shared config)
- Custom addons (copy HTML, MJML error panels) — future additions
- `<MjmlHead>` configuration (attributes, breakpoints, styles) in the decorator
- A dedicated `renderMailHtml` utility function — the decorator handles rendering inline for now

## Decisions

### Storybook 10 with `@storybook/react-vite`

Use Storybook 10.x with the Vite framework integration.

- **Why Storybook 10**: Latest stable version. The existing monorepo storybooks use v9, but since this is a standalone local storybook with no cross-references, version alignment is unnecessary. pnpm's content-addressable store handles multiple versions cleanly.
- **Why Vite over webpack**: The package is ESM-only. Vite has native ESM support and faster cold starts. The reference project also uses `@storybook/react-vite`.
- **Alternative considered**: Match monorepo's Storybook 9 + webpack5. Rejected because it adds complexity for ESM support and the storybook is isolated.

### Inline rendering in the decorator (no separate utility)

The `MailRendererDecorator` contains the full rendering pipeline directly:

1. Wrap the story node in `<Mjml><MjmlBody>...</MjmlBody></Mjml>`
2. Call `renderToMjml()` to get an MJML string
3. Call `mjml2html()` from `mjml-browser` to get HTML
4. Render via `dangerouslySetInnerHTML`

- **Why inline**: Keeps the setup minimal. A reusable `renderMailHtml` function can be extracted later when needed outside storybook (e.g., for tests or a preview API).
- **Why `mjml-browser`**: Browser-compatible MJML compiler. It's a devDependency only — not shipped with the library. The reference project uses the same approach.
- **Why no `<MjmlHead>`**: Keeps the initial setup simple. Head configuration (fonts, breakpoints, global attributes) can be added when components need it.

### Stories alongside source code

Stories live in `src/` next to the components they document, using the `__stories__/*.stories.tsx` pattern inside each component's directory. Components are organized in directories by concern (e.g., `src/components/section/MjmlSection.tsx` with stories at `src/components/section/__stories__/MjmlSection.stories.tsx`). This matches the convention used in the monorepo admin packages.

### Port 6066

Use port 6066 to avoid any ambiguity with the Storybook default (6006). The existing monorepo storybooks use 26638, 26646, and 4004 — 6066 is unused.

### dev-pm integration

Add a `storybook-mail-react` entry to the monorepo's `dev-pm.config.ts` in the `"storybook"` group (not `"docs"` — the mail storybook is not deployed or connected to the docs ecosystem). No `waitOn` is needed since Storybook with Vite resolves imports from source directly.

## Risks / Trade-offs

- **Storybook version divergence from monorepo** → Acceptable since storybooks are independent. If future integration is needed, migration is straightforward.
- **`mjml-browser` adds ~1MB to devDependencies** → Only affects install time, not the published package. Worth it for live previews.
- **No `<MjmlHead>` means stories don't reflect real-world email defaults** → Acceptable for now. Components render correctly without it; global styles/attributes are additive.
- **MJML warnings logged to console only** → `mjml2html` returns an `errors` array (these are non-breaking warnings despite the name — MJML's naming, not ours). The decorator destructures this as `mjmlWarnings` and logs each via `console.warn`. A dedicated panel addon can surface these more prominently in the future.
