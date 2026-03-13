# ADR: Coding Guidelines as Single Source of Truth

- **Status:** Accepted
- **Date:** 2026-03-13

## Context

The Comet coding guidelines currently live as hand-written Docusaurus pages in `docs/docs/9-coding-guidelines/` (14 files covering Git, TypeScript, React, NestJS, CSS, accessibility, and more). These docs are written for human consumption and use Docusaurus-specific syntax (admonitions, frontmatter, image references).

AI agents have no structured access to these guidelines. The only way to make agents aware of coding standards is to duplicate the content into agent-consumable formats (Cursor rules, agent skills), which creates a maintenance burden and inevitable drift between the human docs and agent instructions.

Both humans and agents need to follow the same guidelines, so maintaining two separate copies is unsustainable.

## Decision

Move the single source of truth for coding guidelines to `spec/standards/coding-guidelines/` as granular, tool-agnostic markdown files (one per topic, 14 files total). From these standards files, generate:

1. **Docusaurus docs** in `docs/docs/9-coding-guidelines/` -- preserving the current file names, page structure, admonitions, and image references so the human-facing docs remain unchanged
2. **An agent skill** at `.agents/skills/coding-guidelines/SKILL.md` -- giving AI agents access to the same guidelines as structured, actionable instructions

The standards files use plain markdown with lightweight structured markers (HTML comments) for Docusaurus-specific elements like admonitions and images, keeping the source format portable and not tied to any particular rendering tool.

## Alternatives Considered

1. **Keep Docusaurus docs as the SSoT** -- Agents cannot consume Docusaurus syntax directly; would require manual duplication into agent-friendly formats, leading to drift.
2. **Single large ADR or markdown file** -- Violates the purpose of ADRs (which capture decisions, not reference material) and would be too large to maintain or consume effectively.
3. **Cursor rules only** -- Would give agents access but leave humans without rendered documentation; Cursor rules also have size and format constraints that make them unsuitable for 14 topics of guidelines.

## Consequences

- All changes to coding guidelines go through the standards files in `spec/standards/coding-guidelines/`.
- The Docusaurus docs and agent skill become generated artifacts and must not be edited directly.
- A generation step is needed to produce both the docs and the skill from the standards.
- The generated docs must match the current docs as closely as possible to avoid disruption.
