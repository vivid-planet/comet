---
name: major-migration
description: Migrates a Comet project across a major version (e.g. v4 → v5, v8 → v9). Use when the user asks to upgrade Comet, follow a Comet migration guide, or bump @comet/* packages to a new major.
---

# Major Comet Version Migration Skill

## Table of Contents

1. [When to use](#when-to-use)
2. [Locate the migration guide](#locate-the-migration-guide)
3. [Detect the project shape](#detect-the-project-shape)
4. [Workflow](#workflow)
5. [When the guide is unclear](#when-the-guide-is-unclear)
6. [When to stop and ask the human](#when-to-stop-and-ask-the-human)
7. [Final verification via clean subagent](#final-verification-via-clean-subagent)
8. [Offer a smoke test](#offer-a-smoke-test)

---

## When to use

- Upgrading `@comet/*` packages across a major version in a project (root, API, Admin, Site).
- A Comet major release typically bundles breaking changes across React / Next.js / MUI X and may also require updating peer/third-party packages.

Do NOT use this skill for minor or patch upgrades, or for ongoing feature work on a project already on the target major.

---

## Locate the migration guide

1. **Find out the target major version** from the user if not already specified.
2. **Browse the migration-guide index:**
    - https://github.com/vivid-planet/comet/tree/main/docs/docs/7-migration-guide
    - Use a GitHub MCP tool if one is available (`mcp__github__*`, or a similar namespace). Otherwise use `WebFetch`.
    - Look for a file named `migration-from-v{N}-to-v{N+1}.md` matching the target major.
3. **Download the raw Markdown** so all content is in context. The URL pattern is:
    ```
    https://raw.githubusercontent.com/vivid-planet/comet/refs/heads/main/docs/docs/7-migration-guide/migration-from-v{N}-to-v{N+1}.md
    ```
    Example: `https://raw.githubusercontent.com/vivid-planet/comet/refs/heads/main/docs/docs/7-migration-guide/migration-from-v4-to-v5.md`.
4. **If no guide exists for the target version,** stop and tell the user. Do not attempt a migration without an official guide.

---

## Detect the project shape

Before starting the migration, figure out what's actually in this project. Comet projects vary — **anywhere between 0 and N sites is possible**, plus the page tree is optional:

- **0 sites** — admin-only / headless project (no site package anywhere in the repo). **Skip every site step in the guide**, including site-specific `package.json` edits, codemods, config changes, and verification commands. Do not treat the missing site as an error.
- **1 site** — single-site project. Run the site section of the guide once.
- **2+ sites** — multi-site project. **Run the site section of the guide once per site.** Each site has its own `package.json`, `next.config.js`, `middleware.ts`, etc. — a change applied to one is not a change applied to the others, and skipping the duplicates is the most common multi-site migration miss.
- Some projects also don't expose a page tree (pure structured-content backends) — skip page-tree-specific steps in that case.

Sites can live under `site/`, `sites/<tenant>/`, or any custom path, so don't assume `site/` exists. Discover them by scanning all `package.json` files in the repo for the `@comet/site-nextjs` dependency — that's the canonical marker:

```bash
grep -l '"@comet/site-nextjs"' $(find . -name package.json -not -path '*/node_modules/*' -not -path '*/.next/*')
```

Record the resolved list of site directories somewhere durable (e.g. a note on the first `TaskCreate` task, or a scratch line at the top of the task plan) so every site-section pass can reference the same list. If the result is empty, write "no site package — skip site sections" in the same place so later steps remember to skip.

---

## Workflow

1. **Read the guide end-to-end first.** Note every section, every code change, every codemod, and every verification command. Don't skim — breaking changes hide in sub-bullets.
2. **Create tasks** with `TaskCreate` — one per major section in the guide. For the site section, create **one task per resolved site** (see [Detect the project shape](#detect-the-project-shape)), or skip site tasks entirely if no site package was found. Mark `in_progress` when starting, `completed` when the section lints and commits cleanly.
3. **Ensure a clean working tree.** The user should be on a migration branch with `git status` clean. If not, confirm before continuing.
4. **Work through the guide section-by-section, in order.**
    - Apply every change listed in the section (package.json edits, code edits, config changes).
    - **For the site section, repeat every step once per resolved site.** Each site has its own `package.json`, config, and source tree — apply codemods and edits in each one. If the project has no site package, skip the section entirely.
    - Run any codemods the section prescribes. Do not skip them: codemods catch edge cases hand-fixing misses.
    - Run any verification commands the section prescribes.
    - After each major section: run `npm run lint` (and `npm run test` if tests exist) in the affected package. For multi-site projects, lint each site package after its pass. Fix any failures before moving on.
    - **Commit after each major section** with a message that names the section. For multi-site projects, you can either commit per-site (one commit per site, message names the site) or bundle the site section into a single commit covering all sites — pick one and be consistent. Reverting a single step should stay trivial.
5. **Do not combine sections.** Even if two sections look small, keep their commits separate — it's much easier to bisect later.

---

## When the guide is unclear

If a step in the guide is ambiguous, references a symbol you can't locate, or doesn't match the project's layout, consult these reference sources before guessing:

- **https://github.com/vivid-planet/comet** — the Comet monorepo. Look at the source of the package the guide is talking about (e.g. `@comet/cms-api`, `@comet/admin`) to see the new public API shape, exported types, and examples.
- **https://github.com/vivid-planet/comet-starter** — the canonical reference project. Its code is always kept on the current major and shows the intended usage for admin/API/site patterns. Use it to resolve questions like "how should `tsconfig.json` look after this migration?" or "what's the expected shape of `proxy.ts`?"

Prefer the GitHub MCP (if available) for browsing these repos; fall back to `WebFetch` on the `raw.githubusercontent.com` URL of the specific file you need.

If the ambiguity still isn't resolved after checking both, stop and ask the user — don't guess.

---

## When to stop and ask the human

Stop immediately — don't try to work around — in any of these cases:

- **`npm install` fails** (private-registry auth, peer-dep conflict, sandbox-write denied, or any other error). Hand the exact command to the user and wait for confirmation before continuing.
- **A codemod fails** (panic, missing binary, transform error). Give the user the exact command and wait.
- **Any shell command is blocked by the sandbox** (e.g. `rm -rf node_modules` failing on read-only nested files). Hand the command to the user.
- **A migration step references a file or symbol that doesn't exist** in the project. Ask the user to clarify rather than guessing.

**Commit signing failures are not a blocker.** If `git commit` fails with a signing error (e.g. `1Password: Could not connect to socket`, GPG agent unavailable), retry the commit with `--no-gpg-sign` and continue. Don't ask the user.

After the user confirms the command succeeded, resume from the same step.

---

## Final verification via clean subagent

After the full migration is committed:

1. Dispatch a fresh subagent (via the `Agent` tool, `general-purpose` or `Explore` type) with no context from the migration session.
2. Give it the migration guide URL and the range of commits on the migration branch (`git log main..HEAD`).
3. Ask it to cross-reference: for every section/step in the guide, does a commit implement it? Report any gaps or deviations.
4. Review the subagent's findings with the user and resolve anything missed.

Example prompt skeleton:

```
The branch <branch> migrates this project from Comet v{N} to v{N+1}.
The migration guide is at <raw-md-url>.

For every section and sub-bullet in the guide, verify that a commit in
`git log main..<branch>` implements the required change. Report every
gap, skipped step, or deviation with the relevant file path and a
quote from the guide. Report in under 300 words.
```

Running this with a fresh agent keeps the audit independent of the session that produced the changes.

---

## Offer a smoke test

Once the migration is committed and the clean-subagent audit is resolved, **offer the user a smoke test**. Lint/tsc green is necessary but not sufficient — React/Next/MUI major upgrades introduce dev-only warnings, hydration mismatches, and silent routing breakage that only surface in the browser.

Before starting, tell the user:

- The smoke test drives the admin and site(s) in a real browser via **Playwright MCP** (`mcp__plugin_vps_playwright__browser_*`). They need to confirm that MCP is available in this session.
- The **app must be running** — admin (8000), api (4000), codegens, and **every site service** all `Running` per `dev-pm status`. For multi-site projects each site runs on its own port; check `dev-pm status` for the actual list. Ask them to start whatever isn't running.

The project shape was already detected at the start of the migration (see [Detect the project shape](#detect-the-project-shape)). **Pass it to the subagent in the prompt** rather than making it re-run the discovery `grep` — the subagent has no reason to redo work that's already been done.

If the user agrees and both prerequisites are met, **dispatch the smoke test in a fresh subagent** via the `Agent` tool (`general-purpose` type) — the procedure walks dozens of routes per site and produces a long report, so running it inline would burn the main session's context. The subagent gets all the Playwright MCP tools automatically.

Prompt skeleton for the subagent. Two things you must substitute before dispatching:

- The **absolute path** to `references/migration-smoke-test.md` inside this skill. The skill won't be at `skills/major-migration/` in a consumer project — it lives wherever Claude Code installed it (typically `~/.claude/skills/major-migration/` or `<project>/.claude/skills/major-migration/`). Take the path of the SKILL.md you're currently reading, resolve `references/migration-smoke-test.md` relative to it, and use that absolute path.
- The **detected project shape** — sites with dev URLs and page-tree presence — so the subagent doesn't redo the discovery.

```
Run the smoke-test procedure defined in
`<absolute path to references/migration-smoke-test.md within this skill>`
against this project end-to-end. Read that file first, then execute the
procedure (prerequisites, inventory, admin pass, site pass per site,
triage).

Project shape (already detected — do NOT re-run the discovery grep):
- Sites: <e.g. "none — admin-only project, skip the site pass" |
  "1 site at site/, dev URL http://localhost:3000" |
  "2 sites: sites/de/ at http://localhost:3000, sites/at/ at http://localhost:3001">
- Page tree: <present | absent — skip page-tree CRUD>

Apply the site pass once per listed site (or skip it entirely if none).

Write findings to `test-report.md` at the repo root as you go — that
file is the deliverable. When done, reply with a <200 word summary:
how many routes/URLs you covered (broken down per site if multi-site),
the top 3-5 findings by user impact, and whether anything blocked you
mid-run. Don't paste the full report back; I'll read test-report.md
directly.
```

When the subagent returns, read `test-report.md` and walk the top findings with the user.

If the user declines, skip — the migration is otherwise complete.
