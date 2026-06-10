# Migration Smoke-Test

Run this after a major migration finishes (lint/tsc green, all commits pushed) to catch runtime regressions that lint and tsc can't see.

Lint-clean is necessary but not sufficient. React major upgrades commonly introduce dev-only warnings (DOM-prop leaks, hydration mismatches), Next.js major upgrades break dynamic route resolution silently (async params, percent-encoding rules), and MUI X majors enforce previously-soft props at runtime. None of these surface in `tsc --noEmit` or eslint.

## Table of Contents

1. [Project shape](#project-shape)
2. [Prerequisites](#prerequisites)
3. [Inventory the surface](#inventory-the-surface)
4. [Admin pass](#admin-pass)
5. [Site pass](#site-pass)
6. [Triage findings](#triage-findings)
7. [Output: `test-report.md`](#output-test-reportmd)
8. [Re-verify after fixes](#re-verify-after-fixes)
9. [When to stop and ask the human](#when-to-stop-and-ask-the-human)

---

## Project shape

The dispatching prompt should tell you the project shape — number of sites (with dev URLs / ports) and whether the page tree is present. **Use what's in the prompt; don't re-run the discovery `grep`.**

Possible shapes and how they affect scope:

| Project shape       | Admin pass | Page-tree CRUD | Site pass          |
| ------------------- | ---------- | -------------- | ------------------ |
| Full (admin + site) | yes        | yes            | yes, once per site |
| Admin + no site     | yes        | if applicable  | **skip**           |
| Admin + no PT       | yes        | **skip**       | yes, once per site |

For multi-site projects, the site pass runs **once per site** — each has its own sitemap, URL buckets, and regression surface. A Next.js major can break one site's routes while leaving another working.

Note the shape (verbatim from the prompt) at the top of `test-report.md` so the reader knows exactly what was and wasn't covered, and list each site's directory plus dev URL.

**Fallback only if the prompt is missing this info:** scan for `package.json` files that depend on `@comet/site-nextjs` and grep `admin/src` for `MasterMenu` / `/at/pages/pagetree`. Flag the gap in your final summary so the dispatcher fixes the prompt next time.

```bash
grep -l '"@comet/site-nextjs"' $(find . -name package.json -not -path '*/node_modules/*' -not -path '*/.next/*')
```

---

## Prerequisites

Before starting:

1. **Services running.** Use `dev-pm status`; admin (8000), api (4000), and codegens must be `Running`. The site service only matters if the project has an `@comet/site-nextjs` package — skip checking it on admin-only projects. Restart any that aren't.
2. **Fixtures loaded.** `npm --prefix api run fixtures` — for projects with a page tree, this seeds the URLs the sitemap exposes for sampling. If the migration changed seed/slug logic, re-run fixtures.
3. **Drive the browser via Playwright MCP** (`mcp__plugin_vps_playwright__browser_*`) so console errors are captured. `curl` is fine for HTTP-status sweeps but won't see hydration / DOM-prop errors.
4. **Have a fresh repo-root `test-report.md` ready to write to.** Append findings as you go; don't keep them in conversation.

---

## Inventory the surface

Skip this if the project already has an authoritative inventory file. Otherwise:

- **Admin routes:** read `admin/src/common/MasterMenu.tsx` (or equivalent) and list every `path:` entry. Group by section (Dashboard, Page Tree, Structured Content, System, etc.).
- **Admin grids/forms:** for each route, identify whether it renders a `DataGrid`/`FinalForm`. Note which entities are writable (have Add/Edit/Delete) — those need a full CRUD pass.
- **Site URL buckets** _(skip if no `@comet/site-nextjs` package was detected)_: fetch the site's `sitemap.xml` (usually `http://localhost:3000/sitemap.xml`, but on multi-site setups use the port/host the resolved site actually runs on — check `dev-pm status`). Parse `<loc>` entries. Classify into buckets by URL pattern (e.g. `/news/...`, fixture/scaffold pages, ...). The buckets you see depend on the project.

Save the inventory output briefly in scratch — don't write it to `test-report.md` yet.

---

## Admin pass

Walk the inventory list with Playwright MCP. For each admin route:

1. `browser_navigate` to it (e.g. `http://localhost:8000/at/structured-content/news`).
2. `browser_snapshot` to confirm what rendered. Look for `<main>` containing actual content vs an empty/error fallback.
3. `browser_console_messages level=error` and `level=warning`. Record:
    - count of errors, count of warnings
    - one-line excerpt of each error (`<message>` truncated at ~120 chars)
4. For writable entities, run a CRUD cycle:
    - **Add:** open the Add form, fill required fields with a recognizable value like `playwright-smoke-<timestamp>`. Click Save.
    - **Check the post-save URL.** A literal `undefined`, `null`, or `NaN` segment is a regression — log it. (Example bug: `…/edit/undefined` from `activatePage(\`edit/${tab}\`, id)`when`tab` is undefined.)
    - **Edit:** change one field on the new record, save.
    - **Delete:** remove the record. If the UI has no delete control (action cell shows only "Edit"), that's a finding — verify the underlying mutation still works via the browser console (`fetch('/api/graphql', {method:'POST', body:...})`) before declaring the API broken too.
    - If Save fails, capture the error and skip Edit/Delete so you don't leave half-state behind.

### Page Tree CRUD is mandatory — do it every time (when the project has one)

**Skip this entire subsection if the project has no page tree** (see [Project shape](#project-shape)). Some projects are pure structured-content backends with no `/at/pages/pagetree` route, and forcing a CRUD run there will just hit 404s.

Otherwise: the page tree is _the_ core Comet writable surface and exercises the most upstream code paths (block editor, RTE, file picker, page-tree GraphQL mutations, route-tab navigation). Skipping it leaves big classes of regressions invisible. Run a full Add → Edit → Delete on at least one page-tree category, regardless of what else you tested:

1. Navigate to `/at/pages/pagetree/<category>` (e.g. `main-navigation`).
2. **Add:** click Add, fill Name (slug auto-fills), pick the default Document Type, Save. Confirm the new row appears in the tree and the URL after save is clean (no `undefined`/`null`/`NaN`/duplicated segments).
3. **Edit:** click the new row to open `/edit`. **Walk all tabs** (Blocks, Stage, Seo, Config). The Config tab in particular embeds the RTE and is where React 19 / MUI majors commonly surface prop-leak and `<div>` -in-`<p>` hydration errors that don't appear elsewhere. Capture console after each tab switch. Change one trivial field (e.g. `Menu description`), Save. Reload the page and verify the value persisted by reading the input back.
4. **Delete:** open the row's context menu → Delete → confirm. Verify the row is gone.

If any of those steps fails, that's a blocker for the PR — page tree is the feature most users actually use.

After the run, delete any test records you created (or note them in `test-report.md` as left behind).

### Two errors to expect everywhere

Many Comet projects have one or two errors that fire on _every_ admin page (Sentry init, logo SVG, etc.). Identify them once at the top of the run and call them "baseline" — count per-route errors _above_ baseline rather than reporting baseline N times.

---

## Site pass

**Skip this entire section if the project has no `@comet/site-nextjs` package** anywhere (see [Project shape](#project-shape)). For admin-only / headless projects the site pass is not applicable — note "no site package, site pass skipped" in `test-report.md` and stop here.

**For multi-site projects (2+ resolved site directories), run this whole section once per site.** Do not collapse them — each site has its own sitemap, routes, and regression surface, and a Next.js or middleware regression frequently breaks one site while leaving another working. The way `<n>` sites typically expose themselves:

- Different ports on `localhost` (3000, 3001, …) — check `dev-pm status` for the actual port each site listens on.
- Different hostnames via the project's middleware / domain routing (`site/src/middleware.ts`) — you may need to hit `http://<host>` with a `Host:` header override or via the per-site dev URL.

Write per-site results under their own subheading in `test-report.md` (e.g. `### Site: <site-name> (port 3001)`). Apply every step below to every site.

1. Fetch the site's `sitemap.xml` (`http://localhost:<port>/sitemap.xml`). Parse `<loc>` entries.
2. **Bucket the URLs** by pattern (e.g. locale-prefixed `/de/...`, fixture/scaffold pages, normal pages, ...). Some buckets may contain thousands of URLs and need sampling; others may have only a handful and can be exhausted.
3. **Pick a seeded sample.** Common shape: 20 normal + all of any small bucket the user explicitly cares about. Use a deterministic shuffle (e.g. seeded sort) so re-runs hit the same URLs. If a bucket has fewer entries than the target sample size, take all of them and note the imbalance.
4. For each picked URL: navigate, snapshot, collect console errors and warnings.
5. For high-volume buckets, **bulk-fetch HTTP status first**: a single loop hitting all of them with `curl -s -o /dev/null -w "%{http_code}"` catches blanket 404s (e.g. news-route group completely broken) in seconds. Browser-walk only those that return 200, plus a handful of 404s to see the error page itself.
6. Bytes-check sitemap URLs that contain special characters. If a `<loc>` contains `:`, `?`, `#`, `&`, or other RFC 3986 sub-delims in a path segment, verify the URL actually resolves. (`od -c` or hex-dump to confirm a colon is real, not a terminal-rendering artifact of `&#58;`.)

### Side effect of 404s

Any URL that falls through to the not-found page produces _additional_ errors from the not-found page itself (`<a>` nested in `<a>` from a configurator button, hydration mismatch). Don't count these against the per-URL error budget — they're a single not-found-page bug surfacing N times.

---

## Triage findings

Each console error/warning gets one of three labels — apply this _while_ you're walking the routes, not after:

1. **Project-fixable** — the broken code lives under `admin/src`, `site/src`, or `api/src`. These belong in the migration PR or a follow-up.
2. **Comet upstream** — the broken code lives under `node_modules/@comet/*`. Surface to the user; don't workaround. (See `feedback_comet_upstream.md` memory.)
3. **Pre-existing / out-of-scope** — same warning was present before the migration (font preload, Swiper loop, etc.). Note once at the bottom of `test-report.md`; don't itemize per-route.

If you can't tell from the error message which bucket a finding falls into, grep for the symbol/string in the project source — if it doesn't appear there, it's Comet upstream or a transitive dep.

---

## Output: `test-report.md`

Write findings to `test-report.md` at the repo root as you go. Don't keep them only in conversation — the file is the deliverable.

Suggested structure:

```markdown
# Smoke-test findings — <date>

Tool: Playwright MCP (Chromium). Branch: `<branch>`.
Project shape: <full admin + site(s) | admin-only | admin + no page tree>.
Sites detected: <none | list of site dirs + dev URLs>.
Scope: <admin route count> admin routes; per site, <site URL count> URLs sampled from <total> in sitemap (or "site pass skipped — no site package").

## TL;DR — biggest problems first

<5–8 numbered bullets, ordered by user impact, each with file path or exact error excerpt>

## Session-global console errors (every admin page)

<the 0–2 baseline errors, called out once>

## Admin

### <route>

- **Screen**: clean | "<visible error>"
- **Console**: <n> errors, <m> warnings (above baseline)
    - <one-line excerpt of each>
- **CRUD** (if applicable): create/edit/delete: ok | failed (<why>)

## Sites

(Repeat the block below once per site for multi-site projects. Skip the whole "Sites" section for admin-only projects.)

### Site: <site-name> (<dev-url>)

#### Sampling

- Sitemap total: <n> URLs in <bucket-count> buckets.
- Sample: <breakdown by bucket>.

#### Per-URL results

<grouped by error class, not one heading per URL — e.g. "0 errors", "1 error — Received false for non-boolean attribute active", "3 errors — <a> nested in <a> + hydration">

## Hand off to Comet upstream

<numbered list of upstream bugs with the relevant @comet/\* module path>

## Numbers

- Admin routes visited: <n>. Broken: <n>. With extra console errors: <n>.
- Site URLs sampled: <n total across all sites>. HTTP 200: <n>. HTTP 404: <n>. (Break down per site if results diverge.)

## Cleanup

- Test records left in DB: <list or "none">.
```

Avoid one heading per URL when most of the bucket looks the same — group by failure mode. Five URLs with the same `active={false}` warning are one finding with five examples, not five findings.

---

## Re-verify after fixes

After the engineer fixes the project-fixable findings:

1. **Re-run the failing scenarios in the browser via Playwright MCP** — not just the unit test. A green `tsc` doesn't tell you whether the URL resolves now.
2. **For each item in the "Fixed" list in `test-report.md`**: load one URL that previously hit the bug, capture console messages, confirm the specific error string is gone. Don't just check the error count dropped — a different error could have replaced it.
3. **Re-run fixtures if the migration changed seed/slug logic** before re-checking site URLs. The DB may still hold the pre-fix data.
4. **Bytes-check the sitemap** for previously-broken URL patterns — e.g. if you fixed a `:` in slugs, confirm the sitemap now emits the new form (use `od -c`, not just `grep`, since some special characters render misleadingly in terminals).
5. **Update `test-report.md`** with a "Fixed in this branch" section and move resolved items there. Keep upstream/out-of-scope findings in place.

A useful pattern: ask the user "do you want me to commit each fix atomically?" before starting — answer is almost always yes — and run the smoke test one more time after the commits to confirm pre-commit hooks didn't accidentally revert anything.

---

## When to stop and ask the human

- **Hundreds of URLs in a bucket all 404.** That's a route-group regression, not N individual bugs. Stop and report after the first 5–10 confirm the pattern.
- **A console error mentions a file you can't locate** under `src/` _or_ `node_modules/@comet/*`. Don't guess which bucket it falls into — ask.
- **CRUD test fails with a 500 that suggests data corruption** (FK violation, dangling reference). Stop before continuing to other entities; the test data may be polluting subsequent runs.
- **Playwright MCP can't reach the dev server** at all (timeouts, ECONNREFUSED). Check `dev-pm status`; if everything is `Running` but unreachable, surface the discrepancy to the user before retrying with random restart commands.
