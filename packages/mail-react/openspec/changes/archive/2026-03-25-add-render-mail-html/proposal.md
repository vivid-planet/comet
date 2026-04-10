## Why

Consumers of `@comet/mail-react` currently have to manually handle the MJML-to-HTML conversion step: they must know about the `mjml` vs `mjml-browser` package split, install the correct one for their environment, and write the same boilerplate `renderToMjml` + `mjml2html` glue code in every project. The library should provide a ready-to-use `renderMailHtml` function behind environment-specific import paths (`/server` and `/client`) so consumers get a single-call rendering API without worrying about the underlying MJML packaging.

## What Changes

- Add a `renderMailHtml` function that combines `renderToMjml` and `mjml2html` into a single call, returning `{ html, mjmlWarnings }`
- Expose it via two new package export sub-paths:
  - `@comet/mail-react/server` — uses the `mjml` package (Node.js, requires `fs`)
  - `@comet/mail-react/client` — uses the `mjml-browser` package (browser, requires `window`)
- Add `mjml` as a production dependency (currently not installed)
- Move `mjml-browser` from devDependencies to dependencies
- Simplify the `exports` map in `package.json` to use plain string paths (no explicit `types` conditions), matching the convention used by downstream packages
- Update the storybook `MailRenderer.decorator.tsx` to use the new client `renderMailHtml` instead of manually importing `mjml-browser`

## Capabilities

### New Capabilities

- `render-mail-html`: The `renderMailHtml` function and its server/client sub-path exports

### Modified Capabilities

- `mail-renderer-decorator`: The decorator will use the new `renderMailHtml` from the client sub-path instead of directly importing `mjml-browser`

## Impact

- **package.json**: New `exports` sub-paths (`./server`, `./client`); `mjml` added to dependencies; `mjml-browser` moved to dependencies; simplified `exports` format
- **New source files**: `src/server/index.ts`, `src/server/renderMailHtml.tsx`, `src/client/index.ts`, `src/client/renderMailHtml.tsx`
- **Storybook**: `MailRenderer.decorator.tsx` updated to use the library's own client render function
- **No breaking changes**: The main `"."` export is unchanged; existing consumer code continues to work
