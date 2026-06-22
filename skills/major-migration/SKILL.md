---
name: major-migration
description: Migrates a Comet project across a major version (e.g. v4 → v5, v8 → v9). Use when the user asks to upgrade Comet, follow a Comet migration guide, or bump @comet/* packages to a new major.
---

# Major Comet Version Migration Skill

## When to use

Upgrading `@comet/*` packages across a major version in a project (root, API, Admin, Site). A Comet major typically bundles breaking changes across React / Next.js / MUI X and may require updating peer/third-party packages.

Do NOT use for minor or patch upgrades, or for ongoing feature work on a project already on the target major.

## Locate the migration guide

1. **Find out the target major** from the user if not specified.
2. **Browse the index:** https://github.com/vivid-planet/comet/tree/main/docs/docs/7-migration-guide — use a GitHub MCP tool if available, otherwise `WebFetch`.
3. **Download the raw Markdown** so all content is in context:
    ```
    https://raw.githubusercontent.com/vivid-planet/comet/refs/heads/main/docs/docs/7-migration-guide/migration-from-v{N}-to-v{N+1}.md
    ```
4. **If no guide exists** for the target version, stop and tell the user. Don't migrate without an official guide.

## Detect the project shape

Before starting, figure out what's in this project. Comet projects vary — **anywhere between 0 and N sites is possible**:

- **0 sites** — admin-only/headless. **Skip every site step in the guide** (package.json edits, codemods, config, verification). Don't treat the missing site as an error.
- **1 site** — run the site section once.
- **2+ sites** — **run the site section once per site.** Each site has its own `package.json`, `next.config.js`, `middleware.ts`, etc. Skipping the duplicates is the most common multi-site migration miss.

**Page tree presence is tied to site presence.** Admin-only projects have no page tree — skip page-tree-specific steps. If you encounter the rare divergence (site without page tree, or vice versa), surface it before proceeding.

Sites can live under `site/`, `sites/<tenant>/`, or any custom path. Discover them by scanning `package.json` files for `@comet/site-nextjs`:

```bash
grep -l '"@comet/site-nextjs"' $(find . -name package.json -not -path '*/node_modules/*' -not -path '*/.next/*')
```

Record the resolved site list durably (e.g. a note on the first `TaskCreate` task) so every site-section pass references the same list. If empty, write "no site package — skip site sections".

## Workflow

1. **Read the guide end-to-end first.** Note every section, code change, codemod, and verification command. Breaking changes hide in sub-bullets.
2. **Create tasks** with `TaskCreate` — one per major section. For the site section, create **one task per resolved site**, or skip site tasks if none. Mark `in_progress`/`completed` as you go.
3. **Ensure a clean working tree.** Confirm with the user if not.
4. **Work through the guide section-by-section, in order.**
    - Apply every change in the section.
    - **Site section: repeat every step once per resolved site.** Skip entirely if no site package.
    - Run any codemods the section prescribes — they catch edge cases hand-fixing misses.
    - Run any verification commands.
    - After each section: `npm run lint` (and `npm run test` if present) in the affected package. Multi-site: lint each site after its pass.
    - **Commit after each section** with a message naming the section. For multi-site, either commit per-site or bundle the site section — pick one and be consistent.
5. **Do not combine sections.** Keep commits separate to make bisecting trivial.

## When the guide is unclear

If a step is ambiguous or doesn't match the project, consult before guessing:

- **https://github.com/vivid-planet/comet** — the monorepo. Check the source of the package the guide discusses for the new public API shape.
- **https://github.com/vivid-planet/comet-starter** — the canonical reference project, always kept on the current major. Use it for questions like "how should `tsconfig.json` look after this migration?"

Prefer the GitHub MCP; fall back to `WebFetch` on `raw.githubusercontent.com`. If still unclear, ask the user — don't guess.

## When to stop and ask the human

Stop immediately — don't work around — in any of these cases:

- **`npm install` fails** (auth, peer-deps, sandbox-write, etc.). Hand the user the exact command and wait.
- **A codemod fails** (panic, missing binary, transform error). Hand off the command.
- **A shell command is blocked by the sandbox.** Hand off.
- **A migration step references a file or symbol that doesn't exist.** Ask for clarification.

**Commit signing failures are not a blocker.** If `git commit` fails with a signing error (1Password socket, GPG unavailable), retry with `--no-gpg-sign` and continue.

After the user confirms, resume from the same step.

## Final verification via clean subagent

After the full migration is committed:

1. Dispatch a fresh subagent (`Agent` tool, `general-purpose` or `Explore`) with no session context.
2. Give it the migration guide URL and `git log main..HEAD`.
3. Ask it to cross-reference: for every section/step, does a commit implement it? Report gaps or deviations.
4. Review findings with the user and resolve.

Example prompt:

```
The branch <branch> migrates this project from Comet v{N} to v{N+1}.
The migration guide is at <raw-md-url>.

For every section and sub-bullet in the guide, verify that a commit in
`git log main..<branch>` implements the required change. Report every
gap, skipped step, or deviation with the relevant file path and a
quote from the guide. Report in under 300 words.
```

Running this fresh keeps the audit independent of the session that produced the changes.

## Offer a smoke test

Once committed and audited, **offer the user a smoke test**. Lint/tsc green is necessary but not sufficient — React/Next/MUI majors introduce dev-only warnings, hydration mismatches, and silent routing breakage that only surface in the browser.

Before starting, tell the user:

- The smoke test drives admin and site(s) in a real browser via **Playwright MCP** (`browser_*` tools). Confirm MCP is available.
- The **app must be running** — admin (8000), api (4000), codegens, and **every site service** all `Running` per `dev-pm status`. Multi-site projects run each site on its own port. Ask them to start whatever isn't running.

The project shape was already detected (see [Detect the project shape](#detect-the-project-shape)). **Pass it to the subagent** rather than making it re-run discovery.

If the user agrees and prerequisites are met, **dispatch the smoke test in a fresh subagent** (`Agent` tool, `general-purpose`) — the procedure walks dozens of routes per site and would burn the main session's context inline. The subagent gets the Playwright MCP tools automatically.

Two things to substitute in the prompt:

- The **absolute path** to `references/migration-smoke-test.md` inside this skill. The skill lives wherever Claude Code installed it (typically `~/.claude/skills/major-migration/` or `<project>/.claude/skills/major-migration/`). Resolve `references/migration-smoke-test.md` relative to the SKILL.md you're reading.
- The **detected site list** with dev URLs. Page-tree presence follows site presence; only pass it separately if the project diverges.

```
Run the smoke-test procedure defined in
`<absolute path to references/migration-smoke-test.md within this skill>`
against this project end-to-end. Read that file first, then execute the
procedure (prerequisites, inventory, admin pass, site pass per site,
triage).

Sites (already detected — do NOT re-run the discovery grep):
<e.g. "none — admin-only project, skip site pass and page-tree CRUD" |
"1 site at site/, dev URL http://localhost:3000" |
"2 sites: sites/de/ at http://localhost:3000, sites/at/ at http://localhost:3001">

Apply the site pass once per listed site (or skip if none).
Page-tree presence follows site presence — run page-tree CRUD if at
least one site is present, skip otherwise.

Write findings to `test-report.md` at the repo root as you go — that
file is the deliverable. When done, reply with a <200 word summary:
how many routes/URLs you covered (per site if multi-site), the top 3-5
findings by user impact, and whether anything blocked you. Don't paste
the full report back; I'll read test-report.md directly.
```

When the subagent returns, read `test-report.md` and walk the top findings with the user.

If the user declines, skip — the migration is otherwise complete.
