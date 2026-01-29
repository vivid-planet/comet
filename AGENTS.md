# Agent Instructions

## Linting

- Run `pnpm exec eslint --fix <files>` for any modified files that are linted by ESLint before finalizing changes.

## Demo application

- Start the full demo (admin, API, site):
  ```bash
  pnpm exec dev-pm start @demo
  ```
  or
  ```bash
  pnpm run dev:demo
  ```
- Start individual demo services:
  ```bash
  pnpm exec dev-pm start @demo-api @demo-admin @demo-site
  ```

## Rebuilding packages

- Build all Comet packages:
  ```bash
  pnpm run build:packages
  ```
- Build only the packages you changed (repeat the filter as needed):
  ```bash
  pnpm --recursive --filter '<package-name>' run build
  ```
