## Context

The library already has `renderMailHtml` in both client and server variants, and a minimal internal Storybook decorator at `.storybook/MailRenderer.decorator.tsx`. PR #5384 proposed shipping reusable Storybook utilities via two sub-path exports (`storybook-manager` and `storybook-preview`), but that approach requires three manual wiring steps across two files. This change replaces that with a single Storybook addon preset — the idiomatic mechanism used by `@storybook/addon-docs` and other official addons.

Storybook's architecture has two separate JavaScript contexts — the **manager** (main chrome/UI) and the **preview** (story iframe) — which communicate via a channel. Manager code can only import from `storybook/manager-api`, preview code from `storybook/preview-api`. They cannot share a single entry point.

## Goals / Non-Goals

**Goals:**

- Ship the same three addons and rendering decorator as PR #5384 with identical functionality
- Reduce consumer setup to a single line: `addons: ["@comet/mail-react/storybook"]`
- Automatically declare `initialGlobals` so the `usePublicImageUrls` toggle works without runtime errors in Storybook 10
- Keep manager/preview files as internal implementation details — no public API surface beyond the addon name

**Non-Goals:**

- Customizable MJML wrapping (e.g., per-consumer theme providers) — the decorator wraps in a plain `MjmlMailRoot` for now; theme/config support is a future concern when `MjmlMailRoot` gains those props
- Shipping a CSS override for Storybook padding — this is a consumer-level concern
- Build-time configuration (webpack/vite plugins) — the preset only needs manager entries and preview annotations

## Decisions

### Single `./storybook` package export pointing to a preset entry

A single export in `package.json` (`"./storybook": "./lib/storybook/index.js"`) is sufficient. The entry point exports `managerEntries()` and `previewAnnotations()` functions that return filesystem paths to sibling `manager.js` and `preview.js` files. These sibling files are not in the exports map — they're referenced by absolute filesystem path, making them truly internal. The entry point follows the same `index.ts` naming convention as `./client` and `./server`.

Storybook's addon resolution (the `resolveAddonName` function in `core/src/common/presets.ts`) first tries resolving the base name, then sub-paths (`/preset`, `/manager`, `/preview`). When none of the sub-paths resolve, it falls back to loading the resolved base module as a preset. The preset's exported `managerEntries` and `previewAnnotations` functions are then called to discover entries. This is the same mechanism `@storybook/addon-docs` uses.

**Alternative considered:** Two exports (`./storybook/manager` + `./storybook/preview`) with Storybook auto-discovery — rejected because it leaks both files as importable entry points. With the single-preset approach, the only public surface is the addon name `@comet/mail-react/storybook`.

**Alternative considered:** Two flat exports (`./storybook-manager` + `./storybook-preview`) as in PR #5384 — rejected because it requires manual wiring in three places across two files, and the `initialGlobals` declaration is easily forgotten, causing a Storybook 10 runtime error.

### Preset entry uses `node:path` and `node:url` for file resolution

The preset entry (`index.ts`) uses `dirname(fileURLToPath(import.meta.url))` to locate its sibling files. This requires Node.js APIs, which is fine — presets are strictly a Node.js build-time construct, evaluated during Storybook's startup. The manager and preview files run in the browser and use no Node.js APIs.

### Self-executing manager entry (no registration function)

The manager file (`manager.ts`) registers all three addons on import — no `registerMailStorybookAddons()` function. This is the standard pattern for Storybook manager entries (see `@storybook/addon-docs/manager`). The file is loaded by Storybook's addon system, not imported by consumers.

**Alternative considered:** Exported `registerMailStorybookAddons()` function as in PR #5384 — rejected because manager entries are loaded automatically by Storybook; an explicit function call is unnecessary ceremony and requires consumers to create a `manager.tsx` file.

### Preview annotation exports `decorators` and `initialGlobals`

The preview file (`preview.ts`) exports standard Storybook preview annotations: `decorators` (containing the `MailRendererDecorator`) and `initialGlobals` (containing `{ usePublicImageUrls: false }`). Storybook's annotation system collects these exports from all preview annotations and merges them.

This is what fixes the Storybook 10 `initialGlobals` problem — the global is declared by the addon itself, not by the consumer. Consumers cannot forget it.

### Single channel event for render results

The decorator emits one event (`comet-mail-render-result`) carrying `{ html, mjmlWarnings }`. Both the copy-HTML button and the MJML warnings panel subscribe to the same event. The event ID is a hardcoded string literal defined identically in manager and preview source files — no shared import needed (they're in separate JS contexts).

### Info emoji instead of `@storybook/icons`

The `UsePublicImageUrlsToggle` uses the ℹ️ emoji instead of importing `InfoIcon` from `@storybook/icons`. This avoids an additional peer dependency.

### Unified `src/storybook/` directory

All storybook files live under `src/storybook/`. PR #5384 used two directories (`src/storybook-manager/` and `src/storybook-preview/`), but since the preset unifies the entry point, a single directory is cleaner. Manager-only and preview-only files coexist in the same directory since their separation is handled by the entry point's routing.

### `storybook` as optional peer dependency

The `storybook` package is added as an optional `peerDependency` (`>=10.0.0`). This signals that the storybook export requires Storybook to be installed without forcing it on consumers who only use the core mail components.

## Risks / Trade-offs

- **Storybook version coupling**: The addons use `storybook/manager-api`, `storybook/preview-api`, and `storybook/internal/components` — Storybook 10+ APIs. The peer dependency requires `>=10.0.0` to avoid claiming untested compatibility. → Mitigation: the components used (`Button`, `AddonPanel`, `Badge`, `WithTooltip`, `TooltipNote`, `IconButton`) are stable public components.
- **No tree-shaking of storybook source**: TypeScript compiles the storybook source files into `lib/` even though most consumers won't use them. → Acceptable: the files are tiny and the single `exports` entry prevents accidental imports.
- **Node.js APIs in preset entry**: The `index.ts` file imports `node:path` and `node:url`. If a consumer accidentally imports it in a browser context, it would fail. → Mitigated by the `exports` map — only `@comet/mail-react/storybook` resolves, and it's only meant for `addons: [...]` in `main.ts` (a Node.js context).
