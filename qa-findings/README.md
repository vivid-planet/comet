# QA Findings — Exploratory Session (Demo Admin / Site)

Automated exploratory QA session against the Comet demo application (Admin at `localhost:8000`, Site at `localhost:3000`, API at `localhost:4000`), driven with Playwright (Chromium). Browser console messages, failed network requests and GraphQL error responses were captured throughout; every reachable Admin menu area was visited and the main interactive flows (page tree + page editing, DAM upload, CRUD forms with valid/invalid input, data grids, redirects, scope switching, dialogs) were exercised.

## Findings

| #                                                  | Title                                                                                                    | Severity | Area                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- | ------------------------------ |
| [001](001-warnings-grid-invalid-initial-filter.md) | Warnings grid initial filter uses non-existent field `state` → GraphQL 400, filter silently dropped      | major    | Admin / System → Warnings      |
| [002](002-forbidden-shown-as-session-expired.md)   | FORBIDDEN errors shown as "Your login-session has expired" dialog (mapping swapped with UNAUTHENTICATED) | major    | Admin / error handling         |
| [003](003-brevo-error-handler-typeerror.md)        | Brevo error handler throws TypeError on non-object error bodies; Newsletter Config page crashes          | major    | API `@comet/brevo-api` + Admin |
| [004](004-dam-focal-point-svg-rect-errors.md)      | DAM file detail logs SVG `<rect>` attribute errors (`undefinedundefin…`)                                 | minor    | Admin / DAM                    |
| [005](005-react-unknown-prop-leaks.md)             | Unknown-prop React errors (RTE, `DatePickerField`, `PageTreeRowDivider`)                                 | minor    | Admin packages                 |
| [006](006-table-key-prop-spread.md)                | Legacy `Table` spreads `key` inside props object                                                         | minor    | `@comet/admin`                 |
| [007](007-site-404-nested-html.md)                 | Site 404 page renders nested `<html>`/`<body>` → hydration errors                                        | minor    | Site (demo)                    |
| [008](008-admin-unknown-route-blank.md)            | Unknown admin routes render a blank content area (no 404 feedback)                                       | minor    | Admin                          |
| [009](009-apollo-cache-normalization-warnings.md)  | Apollo cache normalization warnings (`DamFile.image`, `UserPermissionsUser`)                             | minor    | Admin                          |
| [010](010-block-preview-hydration-error.md)        | Block preview wraps blocks in `<div>` inside `<p>` → hydration error (Heading block)                     | minor    | Admin preview / Site           |

All findings reproduced deterministically in this session unless noted otherwise in the report. Evidence: per-finding screenshots in `screenshots/` and screencasts (`.webm`) in `screencasts/`.

## Environment notes (not reported as bugs)

- Expected dev noise was ignored (MUI X license watermark, Vite/HMR messages, React DevTools hints, source-map notices).
- `System → Publisher` / `Cron Jobs` failing with FORBIDDEN is expected without Kubernetes locally; only the misleading dialog (finding 002) is reported.
- Outbound network restrictions of the sandbox (Brevo API unreachable) triggered finding 003; the reported bug is the unguarded error handler, not the unreachable host.
- The demo site initially crashed with OOM under its `--max-old-space-size=512` dev setting in this container; environment-specific, not reported.
