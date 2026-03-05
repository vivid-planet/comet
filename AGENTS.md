# Agent Instructions

## Local Usage (IDE / CLI)

- you can expect setup is already done: all dependencies are installed and builds are done
- when making changes, affected packages need to be built, except the build watcher process is running (managed by dev-pm)
- services can be started by dev-pm

## Cloud / Web Usage (Fresh Clone)

When running in the cloud/web environment and repo is cloned from scratch, if required you can:

1. Install dependencies
    - `NODE_USE_ENV_PROXY=1 ./install.sh`
2. Run build for packages you are working on
    - `pnpm --recursive --filter '<package-name>' run build`

**If Docker is available:**

- You can start the full demo application using dev-pm and access it at localhost

**If Docker is not available:**

- You cannot start the full demo application

When making changes to demo api, either start the api and verify it's running or at least run `pnpm run console --help` to verify AppModule is configured correctly and schema.gql/block-meta.json regenerates.

## Linting

Run the appropriate checks after every change and fix all reported errors.

### In a package (`packages/*`) or demo service (`demo/*`)

Run from the package or service folder, or from the repo root using the `--filter` flag:

```bash
# Auto-fix ESLint issues (also applies prettier formatting via eslint-plugin-prettier)
pnpm run lint:eslint --fix
# or from repo root:
pnpm --filter <package-name> run lint:eslint --fix

# Fix remaining prettier errors (if any still reported after lint:eslint --fix)
pnpm exec prettier --write .
# or from repo root:
pnpm --filter <package-name> exec prettier --write .

# Verify all checks pass: prettier, eslint, tsc
pnpm run lint
# or from repo root:
pnpm --filter <package-name> run lint
```

`tsc` errors must be fixed manually. There is no standalone prettier format script — prettier formatting is applied via `lint:eslint --fix`.

### In `docs/`

Run from the `docs/` folder:

```bash
# Auto-fix ESLint issues
pnpm run lint:eslint --fix

# Verify all checks pass: prettier, eslint, cspell
pnpm run lint
```

For cspell errors: add unknown words to `.cspellignore` at the repo root.

### For `.changeset/*.md` files

Run from the repo root:

```bash
pnpm cspell .changeset/*.md
```

Add unknown words to `.cspellignore` at the repo root.

## Demo application

This repository includes a demo application which is showcasing the libraries.

- Start the full demo (admin, API, site):
    ```bash
    pnpm exec dev-pm start @demo
    ```
    or
    ```bash
    pnpm run dev:demo
    ```

**Api:**
Demo backend API (NestJS, PostgreSQL)

- Start using `pnpm exec dev-pm @demo-api`
- access at: http://localhost:4000/

**Admin:**
Demo admin app (Vite, React, Apollo)

- Start using `pnpm exec dev-pm @demo-admin`
- access at: http://localhost:8000/
- Usually Login as "Admin" in the IDP Login Page

**Site:**
Demo frontend site (Next.js)

- Start using `pnpm exec dev-pm @demo-site`
- access at: http://localhost:3000/

## Rebuilding packages

- Build all Comet packages:
    ```bash
    pnpm run build:packages
    ```
- Build only the packages you changed (repeat the filter as needed):
    ```bash
    pnpm --recursive --filter '<package-name>' run build
    ```

## Packages

### Admin (`packages/admin/`)

| Package                     | Description                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `@comet/admin`              | Core admin components and framework (React, MUI, Apollo, Final Form)                      |
| `@comet/admin-babel-preset` | Shared Babel preset for transpiling admin packages                                        |
| `@comet/admin-color-picker` | Color picker form field component                                                         |
| `@comet/admin-date-time`    | Date/time picker form field components                                                    |
| `@comet/admin-icons`        | SVG icon library as React components                                                      |
| `@comet/admin-rte`          | Rich text editor component (Draft.js-based)                                               |
| `@comet/admin-generator`    | CLI tool that generates admin CRUD UIs from GraphQL schemas (`comet-admin-generator` bin) |
| `@comet/cms-admin`          | Admin UI for CMS features (pages, blocks, content management)                             |
| `@comet/brevo-admin`        | Admin UI for Brevo email/marketing integration                                            |

### API (`packages/api/`)

| Package                | Description                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `@comet/cms-api`       | NestJS/GraphQL API for CMS features (file uploads, translations, blocks, S3/Azure storage) |
| `@comet/brevo-api`     | NestJS integration for the Brevo email/marketing service                                   |
| `@comet/api-generator` | CLI tool that generates TypeScript types from GraphQL schemas (`comet-api-generator` bin)  |

### Site (`packages/site/`)

| Package              | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `@comet/site-react`  | React components and utilities for the frontend/site layer    |
| `@comet/site-nextjs` | Next.js-specific site layer components (extends `site-react`) |

### Utilities

| Package                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `@comet/cli`           | Central CLI entry point for Comet projects (`comet` bin)   |
| `@comet/eslint-config` | Shared ESLint configurations                               |
| `@comet/eslint-plugin` | Custom ESLint rules for Comet projects                     |
| `@comet/mail-react`    | Utilities for building HTML emails with React (MJML-based) |

### Docs & Storybook

| Package           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `comet-storybook` | Storybook for all Comet components (`storybook/`) |
| `comet-docs`      | Docusaurus documentation site (`docs/`)           |

## Changesets and changelog

- We use Changesets for tracking changes. Create a non-empty changeset file when making relevant user-facing/package changes (not for docs-only, demo-only or internal-only updates).
- See [CONTRIBUTING.md](CONTRIBUTING.md#changeset) for detailed guidelines on when and how to add changesets.
- `CHANGELOG.md` is autogenerated; do not edit it manually.

### Quick changeset creation

To create a changeset file in `.changeset/` directory:

1. Create a markdown file with a descriptive kebab-case name
2. Add YAML frontmatter with package name and version bump type (patch/minor/major)
3. Write a clear description following the guidelines in CONTRIBUTING.md

Example:

```markdown
---
"@comet/package-name": patch
---

Fix description here
```

## Commit messages

- Do not use Conventional Commits.
- If a change is scoped to one package, prefix the commit message with the affected package name. Don't include `@comet/` in the package name.

## Generated demo files

- `demo/api` and `demo/admin` contain `generated/` folders. Do not edit files inside `generated/` directly; rerun `api-generator` or `admin-generator` to update them.
- After any changes to `api-generator` or `admin-generator` execute the generator in demo to update the generated files. Before running, build the package.

### admin-generator

The source for generated files are \*.cometGen.tsx config files. Modify those and re-run `admin-generator` for changes.

### api-generator

The source for generated files are entities, mainly the mikro-orm decorators but also custom `@Crud*` generators.
