# Agent Instructions

## Local Usage (IDE / CLI)

- you can expect setup is already done: all dependencies are installed and builds are done
- when making changes, affected packages need to be built, except the build watcher process is running (managed by dev-pm)
- services can be started by dev-pm

## Cloud / Web Usage (Fresh Clone)

When running in the cloud/web environment and repo is cloned from scratch, if required you can:

1. Install dependencies (**only** run if not yet done by eg. pipeline setup, check if `node_modules` exists)
    - `NODE_USE_ENV_PROXY=1 ./install.sh`
2. Run build for packages you are working on (**only** run if build file doesn't exist yet, check if `lib` exists in package)
    - `pnpm --recursive --filter '<package-name>' run build`

**If Docker is available:**

- You can start the full demo application using dev-pm and access it at localhost. Do **not** use docker compose directly, always use dev-pm and start `demo-docker`.

**If Docker is not available:**

- You cannot start the full demo application

When making changes to demo api, either start the api and verify it's running or at least run `pnpm run console --help` to verify AppModule is configured correctly and schema.gql/block-meta.json regenerates.

### Starting the demo application manually (Cloud Agent)

When dev-pm doesn't work (e.g. due to PATH conflicts), follow these steps to start the demo manually.
The main pitfalls are:

- **Ruby `dotenv` conflict**: The system may have a Ruby `dotenv` binary in `/usr/local/bin/dotenv` that shadows the Node.js `dotenv-cli`. Always prepend the local `node_modules/.bin` to PATH: `export PATH="$PWD/node_modules/.bin:$PATH"`
- **Missing `.env.secrets`**: The demo API and admin expect `.env.secrets` files. Create empty ones if they don't exist: `touch demo/api/.env.secrets demo/admin/.env.secrets`
- **Docker port-mapping stalls**: After `docker compose up -d`, the PostgreSQL port (5432) may not be reachable from localhost immediately. If DB connections timeout, run `docker compose restart postgres` and retry.
- **Mitmproxy not needed for screenshots**: The admin Vite dev server proxies `/api` to `API_URL_INTERNAL` which defaults to port 4001 (mitmproxy). Override it in `demo/admin/.env.local` with `API_URL_INTERNAL=http://localhost:4000/api` to skip mitmproxy.

**Step-by-step startup:**

```bash
cd /path/to/comet

# 0. Ensure .env.local and .env.secrets files exist
touch .env.local
touch demo/api/.env.secrets demo/admin/.env.secrets

# 1. Start Docker containers (PostgreSQL, imgproxy, jaeger, valkey, mailpit)
set -a; . .env; . .env.local; set +a
docker compose up -d
# If PostgreSQL connections timeout, restart it:
docker compose restart postgres

# 2. Set PATH to use local node_modules binaries (avoids Ruby dotenv conflict)
export PATH="$PWD/node_modules/.bin:$PATH"

# 3. Load environment
set -a; source .env; source .env.local; set +a

# 4. Start OIDC provider (port 8080)
dev-oidc-provider > /tmp/oidc-provider.log 2>&1 &

# 5. Prepare and start the API (port 4000)
cd demo/api
export PATH="$PWD/node_modules/.bin:$PATH"
pnpm clean && pnpm intl:compile
pnpm db:migrate
pnpm console createBlockIndexViews
NODE_OPTIONS='--max-old-space-size=1024' dotenv -e .env.secrets -e .env.local -e .env -e .env.site-configs -- nest start > /tmp/api-server.log 2>&1 &
cd ../..

# 6. Wait for API to be ready
# Poll with: lsof -i :4000 | grep LISTEN

# 7. Override admin API URL to skip mitmproxy
echo "API_URL_INTERNAL=http://localhost:4000/api" >> demo/admin/.env.local

# 8. Start the admin (port 8001)
cd demo/admin
export PATH="$PWD/node_modules/.bin:$PATH"
dotenv -e .env.secrets -e .env.local -e .env -e .env.site-configs -- vite > /tmp/admin-server.log 2>&1 &
cd ../..

# 9. (Optional) Start oauth2-proxy for authenticated access on port 8000
export OAUTH2_PROXY_UPSTREAMS="http://localhost:8001,http://localhost:4000/api/"
oauth2-proxy > /tmp/oauth2-proxy.log 2>&1 &
```

**Accessing the admin:**

- Direct (no auth): `http://localhost:8001/` — works for screenshots, auto-logs in as "Admin"
- Via oauth2-proxy (with auth): `http://localhost:8000/` — requires OIDC login flow

## Linting

Run the appropriate checks after every change and fix all reported errors.

### Post-Change Workflow

After making changes to any package (`packages/*`) or the demo project (`demo/*`), run `lint:fix` to auto-fix ESLint and Prettier issues:

```bash
# Fix a single package (from the package folder or repo root)
pnpm run lint:fix
# or from repo root:
pnpm --filter <package-name> run lint:fix

# Fix all packages at once (from repo root)
pnpm run lint:fix
```

`tsc` errors must be fixed manually — `lint:fix` does not cover type errors.

### `lint:fix` scripts

Every package and demo service exposes these scripts:

- `lint:fix` — runs `lint:fix:eslint` and `lint:fix:prettier` in parallel (plus `lint:fix:style` in `demo/site`)
- `lint:fix:eslint` — runs ESLint with `--fix` (also applies Prettier formatting via `eslint-plugin-prettier`)
- `lint:fix:prettier` — runs Prettier with `--write` for any remaining formatting issues
- `lint:fix:style` — runs Stylelint with `--fix` (`demo/site` only)

The root-level `lint:fix` runs all workspace `lint:fix` scripts recursively, then formats root-level config files.

### In `docs/`

Run from the `docs/` folder:

```bash
# Auto-fix ESLint + Prettier issues
pnpm run lint:fix

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

**Api:**
Demo backend API (NestJS, PostgreSQL)

- Start using `pnpm exec dev-pm start @demo-api`
- access at: http://localhost:4000/

**Admin:**
Demo admin app (Vite, React, Apollo)

- Start using `pnpm exec dev-pm start @demo-admin`
- access at: http://localhost:8000/
- Usually Login as "Admin" in the IDP Login Page

**Site:**
Demo frontend site (Next.js)

- Start using `pnpm exec dev-pm start @demo-site`
- access at: http://localhost:3000/

### dev-pm

Use dev-pm for managing demo processes:

- command: `pnpm exec -- dev-pm`
- config: `dev-pm.config.ts`

Common commands:

- start script/service: `pnpm exec -- dev-pm start scriptName`
- start group `pnpm exec -- dev-pm start @group`
- view status `pnpm exec -- dev-pm status`
- view logs `pnpm exec -- dev-pm logs --lines 100 scriptName`

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
- Important: See @CONTRIBUTING.md#changeset for detailed guidelines on when and how to add changesets.
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
