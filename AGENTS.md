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

- When making changes in a package, run `pnpm run lint:eslint --fix` in that package folder to autoformat with ESLint before finalizing changes.

## Demo application

This repository includes a demo application which is showcasing the libraries.

**Api:**
Demo backend API (NestJS, PostgreSQL)
- Start using `pnpm run dev-pm @demo-api`
- access at: http://localhost:4000/

**Admin:**
Demo admin app (Vite, React, Apollo)
- Start using `pnpm run dev-pm @demo-admin`
- access at: http://localhost:8000/
- Usually Login as "Admin" in the IDP Login Page

**Site:**
Demo frontend site (Next.js)
- Start using `pnpm run dev-pm @demo-site`
- access at: http://localhost:3000/

## Packages

### Admin (`packages/admin/`)
| Package                      | Description                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `@comet/admin`               | Core admin components and framework (React, MUI, Apollo, Final Form)                     |
| `@comet/admin-babel-preset`  | Shared Babel preset for transpiling admin packages                                       |
| `@comet/admin-color-picker`  | Color picker form field component                                                        |
| `@comet/admin-date-time`     | Date/time picker form field components                                                   |
| `@comet/admin-icons`         | SVG icon library as React components                                                     |
| `@comet/admin-rte`           | Rich text editor component (Draft.js-based)                                              |
| `@comet/admin-generator`     | CLI tool that generates admin CRUD UIs from GraphQL schemas (`comet-admin-generator` bin)|
| `@comet/cms-admin`           | Admin UI for CMS features (pages, blocks, content management)                            |
| `@comet/brevo-admin`         | Admin UI for Brevo email/marketing integration                                           |

### API (`packages/api/`)
| Package                | Description                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `@comet/cms-api`       | NestJS/GraphQL API for CMS features (file uploads, translations, blocks, S3/Azure storage)     |
| `@comet/brevo-api`     | NestJS integration for the Brevo email/marketing service                                       |
| `@comet/api-generator` | CLI tool that generates TypeScript types from GraphQL schemas (`comet-api-generator` bin)      |

### Site (`packages/site/`)
| Package               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `@comet/site-react`   | React components and utilities for the frontend/site layer       |
| `@comet/site-nextjs`  | Next.js-specific site layer components (extends `site-react`)    |

### Utilities
| Package                 | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `@comet/cli`            | Central CLI entry point for Comet projects (`comet` bin)           |
| `@comet/eslint-config`  | Shared ESLint configurations                                       |
| `@comet/eslint-plugin`  | Custom ESLint rules for Comet projects                             |
| `@comet/mail-react`     | Utilities for building HTML emails with React (MJML-based)         |

### Docs & Storybook
| Package            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `comet-storybook`  | Storybook for all Comet components (`storybook/`)    |
| `comet-docs`       | Docusaurus documentation site (`docs/`)              |

## Changesets and changelog

- We use Changesets for tracking changes. Create a non-empty changeset file when making relevant user-facing/package changes (not for docs-only or internal-only updates).
- `CHANGELOG.md` is autogenerated; do not edit it manually.

## Commit messages

- Do not use Conventional Commits.
- If a change is scoped to one package, prefix the commit message with the affected package name. Don't include `@comet/` in the package name.

## Generated demo files

- `demo/api` and `demo/admin` contain `generated/` folders. Do not edit files inside `generated/` directly; rerun `api-generator` or `admin-generator` to update them.
- After any changes to `api-generator` or `admin-generator` execute the generator in demo to update the generated files. Before running, build the package.

### admin-generator

The source for generated files are *.cometGen.tsx config files. Modify those and re-run `admin-generator` for changes.

### api-generator

The source for generated files are entities, mainly the mikro-orm decorators but also custom `@Crud*` generators.

