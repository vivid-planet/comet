---
summary: "Generate Docusaurus docs and agent skill from the coding-guidelines standards files"
implemented: false
---

# Feature: Coding Guidelines Generation

## Goal / Background

The coding guidelines are maintained as tool-agnostic markdown files in `spec/standards/coding-guidelines/` (the single source of truth, per [ADR: Coding Guidelines as SSoT](../adr/coding-guidelines-ssot.md)). Two artifacts need to be generated from these standards:

1. **Docusaurus docs** — human-readable pages in `docs/docs/9-coding-guidelines/`, preserving the current structure, formatting, and content as closely as possible
2. **Agent skill** — a machine-readable skill at `.agents/skills/coding-guidelines/SKILL.md` that gives AI agents access to the same guidelines

Both artifacts are generated; neither should be edited directly. All guideline changes go through the standards files.

- **Jira:** N/A
- **Figma:** N/A

## Requirements & User Stories

### Docusaurus docs generation

- Each standards file maps to exactly one Docusaurus doc file with a specific filename, title, and optional `sidebar_position`
- Structured markers in the standards files (`<!-- admonition: ... -->`, `<!-- image: ... -->`) are transformed to their Docusaurus equivalents
- Cross-file references (`(filename.md)`) are converted to Docusaurus inter-page links (`(./slug)`)
- The generated output must match the current Docusaurus docs as closely as possible — the current docs serve as the reference/expected output
- Images remain in `docs/docs/9-coding-guidelines/images/` and are not generated

### Agent skill generation

- The skill aggregates the guidelines into a single actionable document optimized for AI consumption
- No Docusaurus syntax (admonitions, frontmatter, image references) appears in the skill
- The skill uses plain markdown with clear structure and imperative instructions

## Acceptance Criteria

- [ ] A generation script (or documented manual process) can produce all 14 Docusaurus doc files from the 14 standards files
- [ ] The generated Docusaurus docs match the current docs (same file names, page titles, section structure, admonitions, image references, code examples, cross-page links)
- [ ] The agent skill file exists at `.agents/skills/coding-guidelines/SKILL.md` with valid YAML frontmatter
- [ ] The agent skill contains all guideline topics in a format suitable for AI agents
- [ ] `pnpm --filter comet-docs run lint` passes after generation
- [ ] `pnpm exec cspell "spec/**"` passes

## Implementation Plan

### Step 1: Define the file mapping

Each standards file maps to a Docusaurus doc with specific metadata:

| Standards file          | Docusaurus file                     | `title`                                         | `sidebar_position` |
| ----------------------- | ----------------------------------- | ----------------------------------------------- | ------------------ |
| `index.md`              | `index.md`                          | Coding Guidelines                               | _(none)_           |
| `git.md`                | `01-git-guidelines.md`              | Git Guidelines                                  | -5                 |
| `general.md`            | `02-general.md`                     | General (all programming languages)             | -5                 |
| `secure-development.md` | `03-secure-software-development.md` | Basic principles of secure software development | -5                 |
| `libraries.md`          | `04-libraries-and-techniques.md`    | Libraries and techniques                        | -5                 |
| `naming-conventions.md` | `05-naming-conventions.md`          | Naming conventions                              | -5                 |
| `typescript.md`         | `06-typescript.md`                  | Typescript                                      | -5                 |
| `styling-css.md`        | `07-styling-css.md`                 | Styling / CSS                                   | -5                 |
| `api-nestjs.md`         | `08-api-nestjs.md`                  | API (NestJS)                                    | -5                 |
| `react.md`              | `09-react.md`                       | React                                           | -5                 |
| `kubernetes.md`         | `10-kubernetes.md`                  | Kubernetes                                      | -5                 |
| `cdn.md`                | `11-cdn.md`                         | CDN                                             | -5                 |
| `postgresql.md`         | `12-postgresql.md`                  | PostgreSQL                                      | _(none)_           |
| `accessibility.md`      | `13-accessibility.md`               | Accessibility                                   | _(none)_           |

### Step 2: Transformation rules (standards → Docusaurus)

Apply these transformations in order:

#### 2a. Heading → Frontmatter

Strip the top-level `# Heading` from each standards file. Replace it with Docusaurus YAML frontmatter using the `title` and `sidebar_position` values from the mapping table above.

**Standards input:**

```markdown
# Git Guidelines

## General
```

**Docusaurus output:**

```markdown
---
title: Git Guidelines
sidebar_position: -5
---

## General
```

For `index.md`, the frontmatter has only `title` (no `sidebar_position`).

#### 2b. Admonitions

Convert HTML comment markers to Docusaurus admonition syntax:

- `<!-- admonition: TYPE -->` becomes `:::TYPE`
- `<!-- admonition: TYPE TITLE -->` becomes `:::TYPE TITLE`
- `<!-- /admonition -->` becomes `:::`

The `TYPE` is one of: `tip`, `warning`, `caution`, `note`, `info`. The optional `TITLE` follows the type (e.g., `tip Good`, `warning Bad`).

**Standards input:**

```markdown
<!-- admonition: warning Bad -->

Added margin to footer

<!-- /admonition -->
```

**Docusaurus output:**

```markdown
:::warning Bad
Added margin to footer
:::
```

Preserve all content between the opening and closing markers, including blank lines and nested elements. Remove the blank line immediately after the opening marker and immediately before the closing marker to match Docusaurus conventions.

#### 2c. Image references

Convert image comments to markdown image syntax:

`<!-- image: FILENAME "DESCRIPTION" -->` becomes `![ALT_TEXT](./images/FILENAME)`

The `ALT_TEXT` is derived from the filename by removing the extension and converting to PascalCase (e.g., `activation-squashing.png` → `ActivationSquashing`, `can-i-use.png` → `CanIUse`).

When the original Docusaurus doc included an italic caption below the image (e.g., `_Activation of squashing in MR_`), this caption text comes from the `DESCRIPTION` in the comment. The standards file should use the `caption` flag to indicate this: `<!-- image: FILENAME "DESCRIPTION" caption -->`. When the `caption` flag is present, render the description as `_DESCRIPTION_` on the line immediately below the image.

#### 2d. Cross-file references

Convert internal markdown links from standards-file references to Docusaurus page slugs:

| Standards reference | Docusaurus reference           |
| ------------------- | ------------------------------ |
| `(kubernetes.md)`   | `(./kubernetes)`               |
| `(libraries.md)`    | `(./libraries-and-techniques)` |
| `(typescript.md)`   | `(./typescript)`               |

The slug is derived from the Docusaurus filename by stripping the numeric prefix and `.md` extension (e.g., `06-typescript.md` → `./typescript`).

#### 2e. Preserved elements

The following elements require no transformation and pass through as-is:

- Standard markdown (headings, lists, bold, italic, links, code blocks)
- `<br/>` tags
- External URLs
- Code examples and fenced code blocks

### Step 3: Generate Docusaurus docs

Apply the transformation rules from Step 2 to each standards file, producing the corresponding Docusaurus file in `docs/docs/9-coding-guidelines/`. The generated files should be written with a header comment indicating they are generated:

```markdown
<!-- Generated from spec/standards/coding-guidelines/FILENAME -- do not edit directly -->
```

Alternatively, if adding this comment breaks Docusaurus rendering, omit it and rely on the ADR and this spec to document that the files are generated.

### Step 4: Generate agent skill

Create `.agents/skills/coding-guidelines/SKILL.md` with:

1. **YAML frontmatter** with `name`, `description`, and `compatibility` fields
2. **Introductory paragraph** explaining the skill's purpose
3. **Instructions** telling the agent to read and follow the coding guidelines
4. **Condensed guidelines** — all 14 topics concatenated and reformatted for AI consumption:
    - Strip image references (agents cannot view images)
    - Convert admonition markers to plain emphasis (e.g., `**Bad:**` / `**Good:**` instead of admonition blocks)
    - Keep all code examples, rules, and conventions intact
    - Use clear section headers for each topic
    - Prioritize actionable rules over background context

The skill should be structured so an agent can quickly find the relevant section for its current task (e.g., "Git commit rules", "React conventions", "TypeScript patterns").

### Step 5: Validate

1. Run `pnpm --filter comet-docs run lint` to verify the generated Docusaurus docs pass all checks
2. Run `pnpm exec cspell "spec/**"` and add any unknown words to `.cspellignore`
3. Visually diff the generated Docusaurus docs against the current docs to verify minimal deviation

## Files to Create or Modify

| File                                                              | Action       | Purpose                                  | Package      |
| ----------------------------------------------------------------- | ------------ | ---------------------------------------- | ------------ |
| `spec/standards/coding-guidelines/*.md` (14 files)                | Read (input) | SSoT standards files — generation source | N/A          |
| `docs/docs/9-coding-guidelines/index.md`                          | Generate     | Docusaurus index page                    | `comet-docs` |
| `docs/docs/9-coding-guidelines/01-git-guidelines.md`              | Generate     | Git guidelines doc                       | `comet-docs` |
| `docs/docs/9-coding-guidelines/02-general.md`                     | Generate     | General guidelines doc                   | `comet-docs` |
| `docs/docs/9-coding-guidelines/03-secure-software-development.md` | Generate     | Secure development doc                   | `comet-docs` |
| `docs/docs/9-coding-guidelines/04-libraries-and-techniques.md`    | Generate     | Libraries doc                            | `comet-docs` |
| `docs/docs/9-coding-guidelines/05-naming-conventions.md`          | Generate     | Naming conventions doc                   | `comet-docs` |
| `docs/docs/9-coding-guidelines/06-typescript.md`                  | Generate     | TypeScript doc                           | `comet-docs` |
| `docs/docs/9-coding-guidelines/07-styling-css.md`                 | Generate     | Styling/CSS doc                          | `comet-docs` |
| `docs/docs/9-coding-guidelines/08-api-nestjs.md`                  | Generate     | API/NestJS doc                           | `comet-docs` |
| `docs/docs/9-coding-guidelines/09-react.md`                       | Generate     | React doc                                | `comet-docs` |
| `docs/docs/9-coding-guidelines/10-kubernetes.md`                  | Generate     | Kubernetes doc                           | `comet-docs` |
| `docs/docs/9-coding-guidelines/11-cdn.md`                         | Generate     | CDN doc                                  | `comet-docs` |
| `docs/docs/9-coding-guidelines/12-postgresql.md`                  | Generate     | PostgreSQL doc                           | `comet-docs` |
| `docs/docs/9-coding-guidelines/13-accessibility.md`               | Generate     | Accessibility doc                        | `comet-docs` |
| `.agents/skills/coding-guidelines/SKILL.md`                       | Create       | Agent skill for coding guidelines        | N/A          |

## Dependencies & Open Questions

- **Image caption encoding:** The standards files use `<!-- image: filename.png "description" -->` for all images. For the few images that had italic captions in the original docs (e.g., the squashing activation screenshot), the standards files should include a `caption` flag: `<!-- image: filename.png "description" caption -->`. The existing standards files may need a minor update to add this flag where captions are expected.
- **Generation approach:** The transformation can be implemented as a Node.js script, a shell script, or done manually by an agent following this spec. A script is recommended for repeatability but not strictly required for the initial generation.
- **Generated file markers:** Adding `<!-- Generated -->` comments to the Docusaurus files would make it clear they shouldn't be edited directly, but this needs to be tested to ensure Docusaurus doesn't render or break on the comment.
- **Skill size:** Concatenating all 14 topics into a single skill file may be large. If the file exceeds practical size limits for agent context windows, consider splitting into a skill that references individual topic files rather than inlining everything.
