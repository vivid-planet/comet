## Context

`@comet/mail-react` has no automated tests. The monorepo has established conventions for testing:

- Frontend/utility packages use **Vitest** (`admin`, `cms-admin`, `cli`, `site-react`, `site-nextjs`)
- Each package owns its own `vitest.config.ts` — there is no root-level test config
- Tests are colocated with source files (`*.test.ts(x)` next to the module under test)
- JUnit XML output is generated for CI consumption
- `package.json` scripts: `"test": "vitest --run"` and `"test:watch": "vitest --watch"`

The package is ESM-only (`"type": "module"`, `"module": "NodeNext"`) and uses React with JSX.

## Goals / Non-Goals

**Goals:**

- Establish a Vitest setup that follows monorepo conventions
- Verify the `css` helper works (tagged template → string)
- Verify the server-side render pipeline produces valid HTML (React → MJML → HTML)

**Non-Goals:**

- Testing `client/renderMailHtml` (can be added later)
- Testing the theme system (`createTheme`, `createBreakpoint`, `ThemeProvider`)
- DOM-based or browser-based testing
- Code coverage thresholds
- Snapshot testing

## Decisions

### Vitest with `environment: "node"`

The entire rendering pipeline is server-side string generation: `renderToMjml` uses `ReactDOMServer.renderToStaticMarkup`, and `mjml2html` is a pure string transform. No DOM is needed. This matches the `cli` package's config (the simplest Node-only setup in the monorepo).

**Alternative considered**: `environment: "jsdom"` (used by `admin`, `cms-admin`). Unnecessary overhead — nothing under test requires a DOM.

### Server `renderMailHtml` for the render test

The render test uses `server/renderMailHtml` (backed by the Node `mjml` package), which is the real-world usage path — emails are rendered server-side. The `client/` path (backed by `mjml-browser`) exists for Storybook and can be tested separately later.

### Colocated test files

Tests sit next to their source: `src/utils/css.test.ts` and `src/server/renderMailHtml.test.tsx`. The render test imports components from other modules as test fixtures, but the function under test is `server/renderMailHtml` — so that's where the test lives.

### JUnit reporter

Added alongside the default reporter, producing `junit.xml` — consistent with every other tested package in the monorepo. The file should be gitignored.

## Risks / Trade-offs

- **`mjml` in Node/ESM**: `mjml` is a CJS package. Vitest handles CJS→ESM interop well, but if issues arise, `vitest.config.ts` can add `deps.inline` or `server.deps.inline` to force pre-bundling. Low risk given other monorepo packages do similar CJS interop.
- **Minimal scope**: Only two tests. This is intentional — this is a foundation/POC. More tests can be layered on without config changes.
