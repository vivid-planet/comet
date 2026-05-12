## Context

`@comet/mail-react` currently exports `renderToMjml` (from `@faire/mjml-react`) which converts a React element tree into an MJML string. The next step — converting that MJML string into HTML — is left to the consumer. This requires them to know about the `mjml` / `mjml-browser` package split and write boilerplate glue code.

The `mjml` npm package depends on `mjml-core`, which imports `fs` and `path` at the module scope (in `helpers/mjmlconfig.js`). This means merely importing `mjml` in a browser environment crashes immediately. Conversely, `mjml-browser` is a webpack UMD bundle whose wrapper references `window`, making it incompatible with Node.js environments. There is no single entry point that works in both environments.

## Goals / Non-Goals

**Goals:**
- Provide a single-call `renderMailHtml` function that handles the full React → MJML → HTML pipeline
- Expose it via separate sub-path exports (`/server`, `/client`) to isolate the environment-specific MJML dependency
- Make `mjml` and `mjml-browser` transitive dependencies so consumers don't install them directly

**Non-Goals:**
- Providing a universal/isomorphic single entry point (not possible due to the `fs`/`window` constraint)
- Modifying or wrapping the `mjml2html` options API beyond setting a sensible default for `validationLevel`
- Exposing the `mjml2html` function itself — only the combined `renderMailHtml` is public

## Decisions

### Sub-path exports for environment isolation

The package will add two new export sub-paths in `package.json`:

```json
"exports": {
    ".": "./lib/index.js",
    "./server": "./lib/server/index.js",
    "./client": "./lib/client/index.js"
}
```

**Why sub-paths over a single entry with conditional exports or dynamic `import()`:**
- The `mjml` / `mjml-browser` packages have module-level side effects that execute on import. Bundlers resolve both branches of conditional imports, causing crashes in whichever environment is wrong.
- Sub-path exports are the standard Node.js/bundler mechanism for this exact problem. The consumer makes an explicit, static choice at import time.

**Why simplify the `"."` export to a plain string (drop explicit `types` condition):**
- TypeScript with `moduleResolution: "NodeNext"` automatically discovers `.d.ts` siblings of `.js` files referenced in `exports`. Since `tsc` produces co-located declaration files, explicit `types` conditions are redundant.
- This matches the convention used by downstream packages that build on this library.

### Return type: `{ html, mjmlWarnings }`

The MJML library's `mjml2html` returns `{ html, errors }`. The `errors` field name is misleading — these are validation warnings that don't prevent HTML generation. The `renderMailHtml` function renames this to `mjmlWarnings` to reflect the actual severity.

### Default `validationLevel: "soft"`

Both the server and client implementations default to `validationLevel: "soft"`, which collects warnings without throwing. Consumers can override this and all other `mjml2html` options via the optional second parameter.

### File structure

```
src/
├── server/
│   ├── index.ts              (re-exports renderMailHtml)
│   └── renderMailHtml.tsx     (imports from "mjml")
├── client/
│   ├── index.ts              (re-exports renderMailHtml)
│   └── renderMailHtml.tsx     (imports from "mjml-browser")
└── index.ts                   (unchanged — components, blocks, utilities)
```

Each sub-path directory has its own `index.ts` barrel that exports only `renderMailHtml`. The main `"."` entry is not modified.

### Storybook decorator uses the client sub-path

The `MailRenderer.decorator.tsx` will import `renderMailHtml` from `../src/client/renderMailHtml.js` (a relative import, since storybook code isn't part of the published package). This removes the direct `mjml-browser` import from the decorator and dogfoods the new API.

## Risks / Trade-offs

- **Added dependency weight**: `mjml` and `mjml-browser` become production dependencies. Consumers who only use the server path still get `mjml-browser` in their `node_modules` (and vice versa), though it won't be imported or bundled. This is an acceptable trade-off for the DX improvement.
- **`mjml` types in devDependencies**: `@types/mjml` needs to be added as a devDependency for the server-side code to type-check. `@types/mjml-browser` is already present.
